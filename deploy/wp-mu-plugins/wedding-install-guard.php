<?php
/**
 * Plugin Name: Wedding install guard
 * Description: WordPress is installed by wordpress-setup.sh (wp-cli). Until then, refuse every web request so nobody can claim the site through the web installer.
 * Update URI: false
 */

if (PHP_SAPI !== 'cli' && function_exists('is_blog_installed') && !is_blog_installed()) {
    http_response_code(503);
    header('Retry-After: 30');
    header('Content-Type: text/plain; charset=utf-8');
    exit('Setting up, please retry in a moment.');
}
