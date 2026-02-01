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
    $guests = array_map('sanitize_text_field', $params['guests'] ?? []);
    $meal_preference = sanitize_text_field($params['mealPreference'] ?? '');
    $dietary_restrictions = sanitize_textarea_field($params['dietaryRestrictions'] ?? '');
    $song_request = sanitize_text_field($params['songRequest'] ?? '');
    
    // Build guest names for title
    $guest_names = [];
    foreach ($params['guests'] as $guest) {
        if (!empty($guest['name'])) {
            $guest_names[] = sanitize_text_field($guest['name']);
        }
    }
    $title = implode(', ', $guest_names) ?: 'Anonymous Guest';
    
    // Create RSVP post
    $post_id = wp_insert_post([
        'post_type' => 'wedding_rsvp',
        'post_title' => $title,
        'post_status' => 'publish',
        'meta_input' => [
            'access_code' => $code,
            'attendance' => $attendance ? 'attending' : 'declined',
            'guests' => json_encode($params['guests']),
            'guest_count' => count($guest_names),
            'meal_preference' => $meal_preference,
            'dietary_restrictions' => $dietary_restrictions,
            'song_request' => $song_request,
            'submitted_at' => current_time('mysql'),
        ],
    ]);
    
    if (is_wp_error($post_id)) {
        return new WP_Error('save_failed', 'Could not save RSVP', ['status' => 500]);
    }
    
    // Send email notification
    $admin_email = get_option('admin_email');
    $subject = $attendance ? "🎉 New RSVP: {$title} is attending!" : "💔 RSVP: {$title} cannot attend";
    
    $message = "A new RSVP has been submitted:\n\n";
    $message .= "Guests: {$title}\n";
    $message .= "Status: " . ($attendance ? 'Attending' : 'Declined') . "\n";
    if ($attendance) {
        $message .= "Guest count: " . count($guest_names) . "\n";
        $message .= "Meal preference: {$meal_preference}\n";
        if ($dietary_restrictions) {
            $message .= "Dietary notes: {$dietary_restrictions}\n";
        }
        if ($song_request) {
            $message .= "Song request: {$song_request}\n";
        }
    }
    $message .= "\nAccess code used: {$code}\n";
    $message .= "Submitted: " . current_time('F j, Y g:i a');
    
    wp_mail($admin_email, $subject, $message);
    
    return rest_ensure_response([
        'success' => true,
        'message' => 'RSVP submitted successfully',
        'id' => $post_id,
    ]);
}

/**
 * Helper: Get valid access codes from settings
 */
function wedding_get_valid_codes() {
    $codes_text = get_option('wedding_access_codes', "LOVE2025\nWEDDING\nTEST123");
    $codes = array_filter(array_map('trim', explode("\n", $codes_text)));
    return array_map('strtoupper', $codes);
}
