<?php

// RSVPs and stories have their own permissions, given to administrators and to the "Wedding host" role
// (the couple: RSVPs, stories and the Wedding settings, without being a full WordPress administrator)

const WEDDING_CAPS_VERSION = '1';

add_action('init', 'wedding_sync_roles', 20);
function wedding_sync_roles() {
    if (get_option('wedding_caps_version') === WEDDING_CAPS_VERSION) {
        return;
    }

    $caps = ['manage_wedding', 'upload_files'];
    foreach (['wedding_rsvp', 'wedding_story'] as $type) {
        $post_type = get_post_type_object($type);
        if (!$post_type) {
            return;
        }
        foreach ((array) $post_type->cap as $cap) {
            if (!in_array($cap, ['edit_post', 'read_post', 'delete_post', 'read'], true)) {
                $caps[] = $cap;
            }
        }
    }

    $host = get_role('wedding_host') ?: add_role('wedding_host', 'Wedding host', ['read' => true]);
    $admin = get_role('administrator');
    foreach (array_unique($caps) as $cap) {
        $host->add_cap($cap);
        $admin->add_cap($cap);
    }
    update_option('wedding_caps_version', WEDDING_CAPS_VERSION, false);
}
