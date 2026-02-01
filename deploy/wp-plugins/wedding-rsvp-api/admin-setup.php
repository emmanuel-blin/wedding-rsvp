<?php

// ============================================================================
// WEDDING SETTINGS & CONTENT MANAGEMENT
// ============================================================================

/**
 * Register Wedding Stories Custom Post Type
 */
add_action('init', 'wedding_register_story_post_type');
function wedding_register_story_post_type() {
    register_post_type('wedding_story', [
        'labels' => [
            'name' => 'Our Stories',
            'singular_name' => 'Story',
            'add_new' => 'Add Story',
            'add_new_item' => 'Add New Story',
            'edit_item' => 'Edit Story',
            'all_items' => 'All Stories',
        ],
        'public' => false,
        'show_ui' => true,
        'show_in_menu' => 'wedding-settings',
        'menu_icon' => 'dashicons-format-gallery',
        'supports' => ['title', 'editor', 'thumbnail'],
        'capability_type' => 'post',
    ]);
}

/**
 * Add Wedding Settings Admin Menu
 */
add_action('admin_menu', 'wedding_add_admin_menu');
function wedding_add_admin_menu() {
    add_menu_page(
        'Wedding Settings',
        'Wedding',
        'manage_options',
        'wedding-settings',
        'wedding_settings_page',
        'dashicons-heart',
        30
    );
    
    add_submenu_page(
        'wedding-settings',
        'Settings',
        'Settings',
        'manage_options',
        'wedding-settings',
        'wedding_settings_page'
    );
}

/**
 * Register Settings
 */
add_action('admin_init', 'wedding_register_settings');
function wedding_register_settings() {
    register_setting('wedding_settings', 'wedding_hero_image');
    register_setting('wedding_settings', 'wedding_hero_subtitle');
    register_setting('wedding_settings', 'wedding_hero_title');
    
    register_setting('wedding_settings', 'wedding_date');
    register_setting('wedding_settings', 'wedding_time');

    register_setting('wedding_settings', 'wedding_couple_name1');
    register_setting('wedding_settings', 'wedding_couple_name2');

    register_setting('wedding_settings', 'wedding_our_story_subtitle');
    register_setting('wedding_settings', 'wedding_our_story_title');

    register_setting('wedding_settings', 'wedding_location_subtitle');
    register_setting('wedding_settings', 'wedding_location_title');

    register_setting('wedding_settings', 'wedding_cityHall_name');
    register_setting('wedding_settings', 'wedding_cityHall_address');
    register_setting('wedding_settings', 'wedding_cityHall_description');
    register_setting('wedding_settings', 'wedding_cityHall_getting_there1');
    register_setting('wedding_settings', 'wedding_cityHall_getting_there2');
    register_setting('wedding_settings', 'wedding_cityHall_getting_there3');

    register_setting('wedding_settings', 'wedding_venue_name');
    register_setting('wedding_settings', 'wedding_venue_address');
    register_setting('wedding_settings', 'wedding_venue_description');
    register_setting('wedding_settings', 'wedding_venue_getting_there1');
    register_setting('wedding_settings', 'wedding_venue_getting_there2');
    register_setting('wedding_settings', 'wedding_venue_getting_there3');

    register_setting('wedding_settings', 'wedding_timeline_subtitle');
    register_setting('wedding_settings', 'wedding_timeline_title');

    register_setting('wedding_settings', 'wedding_cityHall_name');
    register_setting('wedding_settings', 'wedding_cityHall_shortname');

    register_setting('wedding_settings', 'wedding_photo_time');
    register_setting('wedding_settings', 'wedding_photo_name');
    register_setting('wedding_settings', 'wedding_photo_shortname');

    register_setting('wedding_settings', 'wedding_dinner_time');
    register_setting('wedding_settings', 'wedding_dinner_name');
    register_setting('wedding_settings', 'wedding_dinner_shortname');

    register_setting('wedding_settings', 'wedding_dancing_time');
    register_setting('wedding_settings', 'wedding_dancing_name');
    register_setting('wedding_settings', 'wedding_dancing_shortname');

    register_setting('wedding_settings', 'wedding_form_title');
    register_setting('wedding_settings', 'wedding_form_subtitle');

    register_setting('wedding_settings', 'wedding_access_codes');
}

/**
 * Settings Page HTML
 */
function wedding_settings_page() {
    include plugin_dir_path(__FILE__) . 'admin-settings.php';
}
