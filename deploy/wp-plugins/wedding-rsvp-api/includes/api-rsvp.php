<?php

/**
 * Register Wedding RSVP REST API Endpoint
 */
add_action('rest_api_init', 'wedding_register_rsvp_routes');
function wedding_register_rsvp_routes() {
    // RSVP submission endpoint
    register_rest_route('wedding/v1', '/rsvp', [
        'methods' => 'POST',
        'callback' => 'wedding_handle_rsvp_submission',
        'permission_callback' => '__return_true',
    ]);

    // Code validation endpoint
    register_rest_route('wedding/v1', '/validate-code', [
        'methods' => 'POST',
        'callback' => 'wedding_validate_access_code',
        'permission_callback' => '__return_true',
    ]);
}

/**
 * Validate Access Code
 */
function wedding_validate_access_code($request) {
    $params = $request->get_json_params();
    $code = strtoupper(sanitize_text_field($params['code'] ?? ''));

    // Get valid codes from settings
    $valid_codes = wedding_get_valid_codes();

    if (in_array($code, $valid_codes)) {
        return rest_ensure_response([
            'valid' => true,
            'message' => 'Access granted',
        ]);
    }

    return new WP_Error(
        'invalid_code',
        'Invalid access code. Please check your invitation.',
        ['status' => 403]
    );
}

/**
 * Handle RSVP Submission
 */
function wedding_handle_rsvp_submission($request) {
    $params = $request->get_json_params();

    // Validate access code
    $code = strtoupper(sanitize_text_field($params['accessCode'] ?? ''));
    $valid_codes = wedding_get_valid_codes();

    if (!in_array($code, $valid_codes)) {
        return new WP_Error('invalid_code', 'Invalid access code', ['status' => 403]);
    }

    // Sanitize data
    $attendance = sanitize_text_field($params['attendance'] ?? '');
    // Guests: keep only first/last name and a known age category, drop rows without a name
    // (full "name" kept too, for the post title and the digest)
    $age_categories = ['adult', 'teen', 'child', 'baby'];
    $guests = [];
    foreach (is_array($params['guests'] ?? null) ? $params['guests'] : [] as $guest) {
        if (!is_array($guest)) {
            continue;
        }
        $first_name = sanitize_text_field($guest['firstName'] ?? '');
        $last_name = sanitize_text_field($guest['lastName'] ?? '');
        // Old shape ({name}) from a form loaded before the first/last name split
        if ($first_name === '' && $last_name === '') {
            $first_name = sanitize_text_field($guest['name'] ?? '');
        }
        $name = trim("{$first_name} {$last_name}");
        if ($name === '') {
            continue;
        }
        $age = sanitize_key($guest['ageCategory'] ?? '');
        $guests[] = [
            'firstName' => $first_name,
            'lastName' => $last_name,
            'name' => $name,
            'ageCategory' => in_array($age, $age_categories, true) ? $age : 'adult',
        ];
    }
    if (!$guests) {
        return new WP_Error('missing_guests', 'At least one guest name is required', ['status' => 400]);
    }
    // The form sends the selected meal options as an array of keys (e.g. ["meat", "vegan"])
    $meal_options = is_array($params['mealPreferences'] ?? null) ? $params['mealPreferences'] : [];
    $meal_preference = implode(', ', array_filter(array_map('sanitize_text_field', $meal_options)));
    $allergen_options = is_array($params['allergens'] ?? null) ? $params['allergens'] : [];
    $allergens = implode(', ', array_filter(array_map('sanitize_text_field', $allergen_options)));
    $dietary_restrictions = sanitize_textarea_field($params['dietaryRestrictions'] ?? '');
    $song_request = sanitize_text_field($params['songRequest'] ?? '');

    // Build guest names for title
    $guest_names = array_column($guests, 'name');
    $title = implode(', ', $guest_names);

    // Create RSVP post
    $post_id = wp_insert_post([
        'post_type' => 'wedding_rsvp',
        'post_title' => $title,
        'post_status' => 'publish',
        'meta_input' => [
            'access_code' => $code,
            'attendance' => $attendance ? 'attending' : 'declined',
            // Post meta is unslashed on save: slash the JSON so quotes and accents survive
            'guests' => wp_slash(wp_json_encode($guests, JSON_UNESCAPED_UNICODE)),
            'guest_count' => count($guest_names),
            'meal_preference' => $meal_preference,
            'allergens' => $allergens,
            'dietary_restrictions' => $dietary_restrictions,
            'song_request' => $song_request,
            'submitted_at' => current_time('mysql'),
            // Picked up by the nightly digest email (wedding_send_rsvp_digest)
            'notified' => '0',
        ],
    ]);

    if (is_wp_error($post_id)) {
        return new WP_Error('save_failed', 'Could not save RSVP', ['status' => 500]);
    }

    return rest_ensure_response([
        'success' => true,
        'message' => 'RSVP submitted successfully',
        'id' => $post_id,
    ]);
}

/**
 * Nightly digest: one email to the hosts with the RSVPs received since the last one.
 * WP-Cron only runs on page visits: wordpress-entrypoint.sh calls wp-cron.php
 * every 5 minutes so the digest goes out on time.
 */
add_action('init', 'wedding_schedule_rsvp_digest');
function wedding_schedule_rsvp_digest() {
    $hour = wedding_digest_hour();
    $event = wp_get_scheduled_event('wedding_rsvp_digest');

    // (Re)schedule when missing, or when the hour, the site timezone or DST changed
    if ($event && (int) wp_date('G', $event->timestamp) === $hour) {
        return;
    }
    wp_clear_scheduled_hook('wedding_rsvp_digest');

    $start = new DateTime(sprintf('today %02d:00', $hour), wp_timezone());
    if ($start->getTimestamp() <= time()) {
        $start->modify('+1 day');
    }
    wp_schedule_event($start->getTimestamp(), 'daily', 'wedding_rsvp_digest');
}

/**
 * Helper: digest hour (0-23, site timezone) from WEDDING_DIGEST_HOUR, default 2 am
 */
function wedding_digest_hour() {
    $hour = getenv('WEDDING_DIGEST_HOUR');
    return ($hour !== false && ctype_digit($hour) && (int) $hour < 24) ? (int) $hour : 2;
}

/**
 * Helper: digest recipients set in Wedding → Emails, else the WordPress admin email
 */
function wedding_get_digest_recipients() {
    $recipients = array_values(array_filter(wedding_get_option_lines('wedding_digest_recipients'), 'is_email'));
    return $recipients ?: [get_option('admin_email')];
}

/**
 * Send the digest. Returns the number of RSVPs sent, 0 if there was nothing new,
 * false if sending failed, null if another send is already running.
 * Run by WP-Cron and by the "Send email now" button.
 */
add_action('wedding_rsvp_digest', 'wedding_send_rsvp_digest');
function wedding_send_rsvp_digest() {
    // Lock so the nightly run and the button never email the same RSVPs twice:
    // add_option() fails when the row exists. A lock older than 10 minutes is left
    // over from a run that crashed, so it is taken over.
    if (!add_option('wedding_digest_lock', time(), '', 'no')) {
        if (time() - (int) get_option('wedding_digest_lock') < 10 * MINUTE_IN_SECONDS) {
            return null;
        }
        update_option('wedding_digest_lock', time(), false);
    }

    try {
        return wedding_build_and_send_digest();
    } finally {
        delete_option('wedding_digest_lock');
    }
}

/**
 * Helper: build and send the digest (call wedding_send_rsvp_digest, which holds the lock)
 */
function wedding_build_and_send_digest() {
    $rsvps = get_posts([
        'post_type' => 'wedding_rsvp',
        'posts_per_page' => -1,
        'orderby' => 'date',
        'order' => 'ASC',
        'meta_key' => 'notified',
        'meta_value' => '0',
    ]);
    if (!$rsvps) {
        return 0; // Nothing new: no email
    }

    $new_attending = 0;
    $message = '';
    foreach ($rsvps as $rsvp) {
        $attending = get_post_meta($rsvp->ID, 'attendance', true) === 'attending';
        $new_attending += $attending ? 1 : 0;

        // Titles are HTML-encoded on save ("Tom &amp; Jerry"): decode for the plain-text email
        $message .= "Guests: " . wp_specialchars_decode($rsvp->post_title, ENT_QUOTES) . "\n";
        $message .= "Status: " . ($attending ? 'Attending' : 'Declined') . "\n";
        if ($attending) {
            $message .= "Guest count: " . get_post_meta($rsvp->ID, 'guest_count', true) . "\n";
            $details = [
                'meal_preference' => 'Meal preference',
                'allergens' => 'Allergens',
                'dietary_restrictions' => 'Dietary notes',
                'song_request' => 'Song request',
            ];
            foreach ($details as $key => $label) {
                $value = get_post_meta($rsvp->ID, $key, true);
                if ($value) {
                    $message .= "{$label}: {$value}\n";
                }
            }
        }
        $message .= "Access code used: " . get_post_meta($rsvp->ID, 'access_code', true) . "\n";
        $message .= "Submitted: " . get_the_date('F j, Y g:i a', $rsvp) . "\n\n";
    }

    // Running totals over every RSVP, so the hosts know where they stand
    $total_guests = 0;
    $total_declined = 0;
    $all_ids = get_posts(['post_type' => 'wedding_rsvp', 'posts_per_page' => -1, 'fields' => 'ids']);
    foreach ($all_ids as $id) {
        if (get_post_meta($id, 'attendance', true) === 'attending') {
            $total_guests += (int) get_post_meta($id, 'guest_count', true);
        } else {
            $total_declined++;
        }
    }

    $count = count($rsvps);
    $subject = sprintf(
        '💌 Wedding RSVPs: %d new (%d attending, %d declined)',
        $count,
        $new_attending,
        $count - $new_attending
    );
    $header = "New RSVPs since the last email:\n\n";
    $footer = "Total so far: {$total_guests} guests attending, {$total_declined} declined.\n";

    $recipients = wedding_get_digest_recipients();
    if (!wp_mail($recipients, $subject, $header . $message . $footer)) {
        // Left as not notified: retried at the next run. The RSVPs are visible in wp-admin anyway
        error_log('Wedding RSVP: digest email to ' . implode(', ', $recipients) . " failed ({$count} RSVPs, retried next run)");
        return false;
    }

    foreach ($rsvps as $rsvp) {
        update_post_meta($rsvp->ID, 'notified', '1');
    }
    return $count;
}

/**
 * Send emails through SMTP when WEDDING_SMTP_HOST is set (docker-compose.yml).
 * The wordpress image has no sendmail, so without SMTP wp_mail() always fails.
 */
add_action('phpmailer_init', 'wedding_configure_smtp');
function wedding_configure_smtp($phpmailer) {
    $host = getenv('WEDDING_SMTP_HOST');
    if (!$host) {
        return;
    }

    $phpmailer->isSMTP();
    $phpmailer->Host = $host;
    $phpmailer->Port = (int) (getenv('WEDDING_SMTP_PORT') ?: 587);
    // 'tls' (STARTTLS, port 587), 'ssl' (port 465) or 'none'
    $secure = getenv('WEDDING_SMTP_SECURE') ?: 'tls';
    $phpmailer->SMTPSecure = $secure === 'none' ? '' : $secure;

    $user = getenv('WEDDING_SMTP_USER');
    if ($user) {
        $phpmailer->SMTPAuth = true;
        $phpmailer->Username = $user;
        $phpmailer->Password = getenv('WEDDING_SMTP_PASS');
    }

    // Most providers only accept a verified sender (default: the SMTP login)
    $from = getenv('WEDDING_SMTP_FROM') ?: $user;
    if (is_email($from)) {
        $phpmailer->setFrom($from, get_bloginfo('name'), false);
    }
}

/**
 * Log the mailer's error message (visible with: docker logs wordpress_backend)
 */
add_action('wp_mail_failed', function ($error) {
    error_log('Wedding RSVP: wp_mail failed: ' . $error->get_error_message());
});

/**
 * Helper: Get valid access codes from settings
 */
function wedding_get_valid_codes() {
    $codes_text = get_option('wedding_access_codes', "LOVE2025\nWEDDING\nTEST123");
    $codes = array_filter(array_map('trim', explode("\n", $codes_text)));
    return array_map('strtoupper', $codes);
}
