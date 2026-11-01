<?php

/**
 * Plugin Name: Wedding RSVP API
 * Plugin URI: https://github.com/emmanuel-blin/wedding-rsvp/plugins/wedding-rsvp-api
 * Description: Add RSVP functionality to wordpress REST API
 * Requires at least: 5.0
 * Requires PHP: 5.6
 * Version: 1.4.0
 * Update URI: false
 * Author: E.Blin
 * Author URI: https://b-link.xyz
 * Text Domain: Wedding RSVP
 */

    if ( ! defined( 'ABSPATH' ) ) {
        exit;
    }

// ============================================================================
// WEDDING RSVP FUNCTIONALITY
// ============================================================================

// Core functionality
include plugin_dir_path(__FILE__) . 'includes/roles.php';
include plugin_dir_path(__FILE__) . 'includes/themes.php';
include plugin_dir_path(__FILE__) . 'includes/rsvp-type.php';
include plugin_dir_path(__FILE__) . 'includes/api-rsvp.php';
include plugin_dir_path(__FILE__) . 'includes/api-read.php';
include plugin_dir_path(__FILE__) . 'includes/cors.php';
include plugin_dir_path(__FILE__) . 'includes/hardening.php';

// Admin setup
include plugin_dir_path(__FILE__) . 'admin-setup.php';

// Clear the nightly digest on deactivation
register_deactivation_hook(__FILE__, function () {
    wp_clear_scheduled_hook('wedding_rsvp_digest');
    wp_clear_scheduled_hook('wedding_rsvp_digest_more');
});

