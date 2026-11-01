<?php

// Headless site: XML-RPC (pingbacks, remote publishing) and public author listings are not used

if (defined('XMLRPC_REQUEST') && XMLRPC_REQUEST) {
    status_header(403);
    exit('XML-RPC is disabled.');
}

add_filter('wp_sitemaps_enabled', '__return_false');
add_filter('wp_headers', function ($headers) {
    unset($headers['X-Pingback']);
    return $headers;
});

// Hide the user list (login names) from visitors who are not logged in
add_filter('rest_endpoints', function ($endpoints) {
    if (!is_user_logged_in()) {
        unset($endpoints['/wp/v2/users'], $endpoints['/wp/v2/users/(?P<id>[\d]+)']);
    }
    return $endpoints;
});

add_action('template_redirect', function () {
    if (!is_user_logged_in() && (isset($_GET['author']) || is_author())) {
        status_header(404);
        nocache_headers();
        exit;
    }
}, 0);

// "Lost your password?" sends a real email: at most 3 requests per hour per visitor and per account
add_action('lostpassword_post', 'wedding_throttle_password_reset', 10, 2);
function wedding_throttle_password_reset($errors, $user_data = null) {
    $keys = ['wedding_reset_ip_' . md5(wedding_client_ip())];
    if ($user_data instanceof WP_User) {
        $keys[] = 'wedding_reset_user_' . $user_data->ID;
    }

    foreach ($keys as $key) {
        if ((int) get_transient($key) >= 3) {
            $errors->add('wedding_reset_limit', 'Too many password reset requests. Please try again in an hour.');
            return;
        }
    }
    foreach ($keys as $key) {
        set_transient($key, (int) get_transient($key) + 1, HOUR_IN_SECONDS);
    }
}
