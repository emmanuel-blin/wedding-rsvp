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

    $check = wedding_check_access_code($code);
    if (is_wp_error($check)) {
        return $check;
    }

    return rest_ensure_response([
        'valid' => true,
        'message' => 'Access granted',
    ]);
}

/**
 * Handle RSVP Submission
 */
function wedding_handle_rsvp_submission($request) {
    $params = $request->get_json_params();

    // Validate access code
    $code = strtoupper(sanitize_text_field($params['accessCode'] ?? ''));
    $check = wedding_check_access_code($code);
    if (is_wp_error($check)) {
        return $check;
    }

    // Sanitize data
    $attendance = sanitize_text_field($params['attendance'] ?? '');
    // Guests: keep only first/last name and a known age category, drop rows without a name
    // (full "name" kept too, for the post title and the digest)
    $age_categories = ['adult', 'teen', 'child', 'baby'];
    $guests = [];
    $raw_guests = is_array($params['guests'] ?? null) ? $params['guests'] : [];
    if (count($raw_guests) > WEDDING_MAX_GUESTS) {
        return new WP_Error('too_many_guests', 'Too many guests in one RSVP', ['status' => 400]);
    }
    foreach ($raw_guests as $guest) {
        if (!is_array($guest)) {
            continue;
        }
        $first_name = wedding_limit_text(sanitize_text_field($guest['firstName'] ?? ''), 80);
        $last_name = wedding_limit_text(sanitize_text_field($guest['lastName'] ?? ''), 80);
        // Old shape ({name}) from a form loaded before the first/last name split
        if ($first_name === '' && $last_name === '') {
            $first_name = wedding_limit_text(sanitize_text_field($guest['name'] ?? ''), 80);
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
    $meal_preference = wedding_clean_choice_list($params['mealPreferences'] ?? null);
    $allergens = wedding_clean_choice_list($params['allergens'] ?? null);
    $dietary_restrictions = wedding_limit_text(sanitize_textarea_field($params['dietaryRestrictions'] ?? ''), 1000);
    $song_request = wedding_limit_text(sanitize_text_field($params['songRequest'] ?? ''), 200);

    // Build guest names for title
    $guest_names = array_column($guests, 'name');
    $title = implode(', ', $guest_names);

    // Same code and same guest names: the new answer replaces the previous one (no duplicate in the totals)
    $sorted_names = array_map('mb_strtolower', $guest_names);
    sort($sorted_names);
    $guest_key = md5($code . '|' . implode('|', $sorted_names));
    $existing = get_posts([
        'post_type' => 'wedding_rsvp',
        'posts_per_page' => 1,
        'fields' => 'ids',
        'meta_key' => 'guest_key',
        'meta_value' => $guest_key,
    ]);

    // Create (or update) the RSVP post
    $post_id = wp_insert_post([
        'ID' => $existing ? $existing[0] : 0,
        'post_type' => 'wedding_rsvp',
        'post_title' => $title,
        'post_status' => 'publish',
        'meta_input' => [
            'guest_key' => $guest_key,
            'updated_at' => $existing ? current_time('mysql') : '',
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
    ], true);

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
add_action('wedding_rsvp_digest_more', 'wedding_send_rsvp_digest');
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
        'posts_per_page' => WEDDING_DIGEST_BATCH,
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
        if (get_post_meta($rsvp->ID, 'updated_at', true)) {
            $message .= "(Updated answer: replaces the previous one from the same guests)\n";
        }
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
                    // Indent continuation lines so a note cannot pass for another entry
                    $value = str_replace(["\r\n", "\r", "\n"], "\n    ", $value);
                    $message .= "{$label}: {$value}\n";
                }
            }
        }
        $message .= "Access code used: " . get_post_meta($rsvp->ID, 'access_code', true) . "\n";
        $message .= "Submitted: " . get_the_date('F j, Y g:i a', $rsvp) . "\n\n";
    }

    // Running totals over every RSVP, so the hosts know where they stand
    global $wpdb;
    $published = "p.post_type = 'wedding_rsvp' AND p.post_status = 'publish'";
    $join_attending = "JOIN {$wpdb->postmeta} a ON a.post_id = p.ID AND a.meta_key = 'attendance' AND a.meta_value = 'attending'";
    $total_guests = (int) $wpdb->get_var(
        "SELECT COALESCE(SUM(CAST(g.meta_value AS UNSIGNED)), 0) FROM {$wpdb->posts} p {$join_attending}
         JOIN {$wpdb->postmeta} g ON g.post_id = p.ID AND g.meta_key = 'guest_count'
         WHERE {$published}"
    );
    $total_rsvps = (int) $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->posts} p WHERE {$published}");
    $attending_rsvps = (int) $wpdb->get_var("SELECT COUNT(DISTINCT p.ID) FROM {$wpdb->posts} p {$join_attending} WHERE {$published}");
    $total_declined = $total_rsvps - $attending_rsvps;

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
    // A full batch means more RSVPs are waiting: send them in a few minutes
    if ($count >= WEDDING_DIGEST_BATCH) {
        wp_schedule_single_event(time() + 5 * MINUTE_IN_SECONDS, 'wedding_rsvp_digest_more');
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

const WEDDING_MAX_GUESTS = 20;
const WEDDING_DIGEST_BATCH = 100;
const WEDDING_CODE_MAX_FAILURES = 20;

/**
 * Helper: Get valid access codes from settings (none set = nobody can RSVP)
 */
function wedding_get_valid_codes() {
    $codes = array_filter(array_map('trim', explode("\n", (string) get_option('wedding_access_codes', ''))));
    return array_map('strtoupper', $codes);
}

/**
 * Helper: true, or a WP_Error when the code is wrong or this visitor guessed wrong too many times.
 * Only wrong codes count, so guests with the right code are never slowed down.
 */
function wedding_check_access_code($code) {
    $key = 'wedding_code_fail_' . md5(wedding_client_ip());
    $failures = (int) get_transient($key);

    if ($failures >= WEDDING_CODE_MAX_FAILURES) {
        return new WP_Error('too_many_attempts', 'Too many wrong codes. Please try again in a few minutes.', ['status' => 429]);
    }
    if ($code === '' || !in_array($code, wedding_get_valid_codes(), true)) {
        set_transient($key, $failures + 1, 15 * MINUTE_IN_SECONDS);
        return new WP_Error('invalid_code', 'Invalid access code. Please check your invitation.', ['status' => 403]);
    }
    return true;
}

/**
 * Helper: visitor IP. Behind a tunnel or proxy on a private address, trust its CF-Connecting-IP header;
 * otherwise REMOTE_ADDR (the header is ignored when the request comes straight from the internet).
 */
function wedding_client_ip() {
    $ip = $_SERVER['REMOTE_ADDR'] ?? '';
    $is_public = filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) !== false;
    $forwarded = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? '';
    if (!$is_public && filter_var($forwarded, FILTER_VALIDATE_IP) !== false) {
        return $forwarded;
    }
    return $ip;
}

/**
 * Helper: cut a text to $max characters
 */
function wedding_limit_text($text, $max) {
    return mb_substr((string) $text, 0, $max);
}

/**
 * Helper: list of ticked options (meals, allergens) as "a, b": at most 10, 80 characters each
 */
function wedding_clean_choice_list($options) {
    $options = is_array($options) ? array_slice($options, 0, 10) : [];
    $options = array_map(function ($option) {
        return wedding_limit_text(sanitize_text_field(is_scalar($option) ? $option : ''), 80);
    }, $options);
    return implode(', ', array_filter($options));
}
