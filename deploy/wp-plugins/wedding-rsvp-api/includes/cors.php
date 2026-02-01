<?php
/**
 * Add CORS headers for the React frontend
 * Origins configured via WORDPRESS_CORS_ORIGINS environment variable
 */
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        // Get allowed origins from environment variable (set in docker-compose.yml)
        $env_origins = getenv('WORDPRESS_CORS_ORIGINS');
        if (!$env_origins) {
            return $value; // No CORS config, skip
        }
        $allowed_origins = array_map('trim', explode(',', $env_origins));
        
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        
        if (in_array($origin, $allowed_origins)) {
            header('Access-Control-Allow-Origin: ' . $origin);
            header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
            header('Access-Control-Allow-Headers: Content-Type');
            header('Access-Control-Allow-Credentials: true');
        }
        
        return $value;
    });
}, 15);