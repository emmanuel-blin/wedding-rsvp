<?php

/**
 * Register GET Endpoints for Frontend
 */
add_action('rest_api_init', 'wedding_register_get_routes');
function wedding_register_get_routes() {
    // Get all settings
    register_rest_route('wedding/v1', '/settings', [
        'methods' => 'GET',
        'callback' => 'wedding_get_settings',
        'permission_callback' => '__return_true',
    ]);
    
    // Get stories
    register_rest_route('wedding/v1', '/stories', [
        'methods' => 'GET',
        'callback' => 'wedding_get_stories',
        'permission_callback' => '__return_true',
    ]);
}

/**
 * Helper: Get multiple options into an array
 */
function wedding_get_options_array($prefix, $count, $default) {
    $items = [];
    for ($i = 1; $i <= $count; $i++) {
        $items[] = get_option($prefix . $i, $default);
    }
    return $items;
}

/**
 * GET Settings Callback
 */
function wedding_get_settings() {
    $date = get_option('wedding_date', '2026-09-26');
    $time = get_option('wedding_time', '14:00');
    
    return rest_ensure_response([
        'weddingDate' => $date . 'T' . $time . ':00',
        'coupleNames' => [
            get_option('wedding_couple_name1', 'Emma'),
            get_option('wedding_couple_name2', 'John'),
        ],
        'cityHall' => [
            'name' => get_option('wedding_cityHall_name', 'City Hall'),
            'address' => get_option('wedding_cityHall_address', 'City hall address'),
            'description' => get_option('wedding_cityHall_description', 'Join us for the civil ceremony at the local City Hall.'),
            'gettingThere' => wedding_get_options_array('wedding_cityHall_getting_there', 3, 'List of getting there options'),
        ],
        'venue' => [
            'name' => get_option('wedding_venue_name', 'The venue name'),
            'address' => get_option('wedding_venue_address', 'Venue address'),
            'description' => get_option('wedding_venue_description', 'Following the ceremony, join us for a night of celebration, dinner, and dancing.'),
            'gettingThere' => wedding_get_options_array('wedding_venue_getting_there', 3, 'List of getting there options'),
        ],
        'hero' => [
            'heroImage' => get_option('wedding_hero_image', ''),
            'subtitle' => get_option('wedding_hero_subtitle', 'Together with their families'),
            'title' => get_option('wedding_hero_title', 'Request the pleasure of your company'),
        ],
        'ourStory' => [
            'subtitle' => get_option('wedding_our_story_subtitle', 'The highlights'),
            'title' => get_option('wedding_our_story_title', 'Our Story'),
        ],
        'location' => [
            'subtitle' => get_option('wedding_location_subtitle', 'Find Your Way'),
            'title' => get_option('wedding_location_title', 'Location'),
        ],
        'sleepLocation' => [
            'subtitle' => get_option('wedding_sleep_subtitle', 'Need a Place to Stay'),
            'title' => get_option('wedding_sleep_title', 'Accommodation'),
            'description' => get_option('wedding_sleep_description', "Looking for a place to stay? We've partnered with local accommodations to make your visit comfortable. Book your stay near the venue using the links below."),
            'venueName' => get_option('wedding_venue_name', 'The venue name'),
        ],
        'timeline' => [
            'subtitle' => get_option('wedding_timeline_subtitle', 'The Schedule'),
            'title' => get_option('wedding_timeline_title', 'Timeline'),

            'cityHall' => [
                'name' => get_option('wedding_cityHall_name', 'Civil Ceremony'),
                'shortname' => get_option('wedding_cityHall_shortname', 'City Hall'),
            ],
            'photo' => [
                'time' => get_option('wedding_photo_time', '16:00'),
                'name' => get_option('wedding_photo_name', 'Photos & Cocktails'),
                'shortname' => get_option('wedding_photo_shortname', 'Garden Terrace'),
            ],
            'dinner' => [
                'time' => get_option('wedding_dinner_time', '18:00'),
                'name' => get_option('wedding_dinner_name', 'Dinner Recepetion'),
                'shortname' => get_option('wedding_dinner_shortname', 'Grand Ballroom'),
            ],
            'dancing' => [
                'time' => get_option('wedding_dancing_time', '20:00'),
                'name' => get_option('wedding_dancing_name', 'Dancing & Celebration'),
                'shortname' => get_option('wedding_dancing_shortname', 'Dance Floor'),
            ],
        ],
        'form' => [ 
            'title' => get_option('wedding_form_title', 'RSVP'),
            'subtitle' =>get_option('wedding_form_subtitle', 'We Hope You Can Make It'),
        ]
    ]);
}

/**
 * GET Stories Callback
 */
function wedding_get_stories() {
    $posts = get_posts([
        'post_type' => 'wedding_story',
        'posts_per_page' => -1,
        'orderby' => 'menu_order',
        'order' => 'ASC',
    ]);
    
    $stories = [];
    foreach ($posts as $post) {
        $stories[] = [
            'id' => $post->ID,
            'title' => $post->post_title,
            'text' => wp_strip_all_tags($post->post_content),
            'image' => get_the_post_thumbnail_url($post->ID, 'large') ?: '',
        ];
    }
    
    return rest_ensure_response($stories);
}
