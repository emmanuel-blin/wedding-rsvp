<?php

/**
 * Plugin Name: Wedding RSVP API
 * Plugin URI: https://github.com/emmanuel-blin/wedding-rsvp/plugins/wedding-rsvp-api
 * Description: Add RSVP functionality to wordpress REST API
 * Requires at least: 5.0
 * Requires PHP: 5.6
 * Version: 1.0
 * Author: E.Blin
 * Author URI: https://b-link.xyz
 * Text Domain: Wedding RSVP
 */

  if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
  }

// Maybe needed cache control : no-cache, To be checked
// ============================================================================
// WEDDING RSVP FUNCTIONALITY
// ============================================================================

// Core functionality
include plugin_dir_path(__FILE__) . 'includes/rsvp-type.php';
include plugin_dir_path(__FILE__) . 'includes/api-rsvp.php';
include plugin_dir_path(__FILE__) . 'includes/api-read.php';
include plugin_dir_path(__FILE__) . 'includes/cors.php';

// Admin setup
include plugin_dir_path(__FILE__) . 'admin-setup.php';

