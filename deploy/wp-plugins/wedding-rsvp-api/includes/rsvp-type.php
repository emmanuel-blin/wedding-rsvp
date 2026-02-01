<?php

/**
 * Register Wedding RSVP Custom Post Type
 */
add_action('init', 'wedding_register_rsvp_post_type');
function wedding_register_rsvp_post_type() {
    register_post_type('wedding_rsvp', [
        'labels' => [
            'name' => 'RSVPs',
            'singular_name' => 'RSVP',
            'add_new' => 'Add RSVP',
            'add_new_item' => 'Add New RSVP',
            'edit_item' => 'Edit RSVP',
            'view_item' => 'View RSVP',
            'all_items' => 'All RSVPs',
            'search_items' => 'Search RSVPs',
        ],
        'public' => false,
        'show_ui' => true,
        'show_in_menu' => true,
        'menu_icon' => 'dashicons-heart',
        'supports' => ['title', 'custom-fields'],
        'capability_type' => 'post',
    ]);
}

/**
 * Add custom columns to RSVP admin list
 */
add_filter('manage_wedding_rsvp_posts_columns', function($columns) {
    $new_columns = [];
    foreach ($columns as $key => $value) {
        if ($key === 'title') {
            $new_columns[$key] = $value;
            $new_columns['attendance'] = 'Status';
            $new_columns['guest_count'] = 'Guests';
            $new_columns['meal'] = 'Meal';
        } else if ($key !== 'date') {
            $new_columns[$key] = $value;
        }
    }
    $new_columns['date'] = 'Date';
    return $new_columns;
});

add_action('manage_wedding_rsvp_posts_custom_column', function($column, $post_id) {
    switch ($column) {
        case 'attendance':
            $status = get_post_meta($post_id, 'attendance', true);
            echo $status === 'attending' 
                ? '<span style="color: green;">✓ Attending</span>' 
                : '<span style="color: red;">✗ Declined</span>';
            break;
        case 'guest_count':
            echo get_post_meta($post_id, 'guest_count', true) ?: '-';
            break;
        case 'meal':
            echo get_post_meta($post_id, 'meal_preference', true) ?: '-';
            break;
    }
}, 10, 2);
