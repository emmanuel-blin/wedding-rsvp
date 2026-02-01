<div class="wrap">
    <h1>💒 Wedding Settings</h1>
    <form method="post" action="options.php">
        <?php settings_fields('wedding_settings'); ?>
        
        <h2>📅 Date & Time</h2>
        <table class="form-table">
            <tr>
                <th><label for="wedding_date">Wedding Date</label></th>
                <td><input type="date" id="wedding_date" name="wedding_date" value="<?= esc_attr(get_option('wedding_date', '2026-09-26')); ?>" class="regular-text"></td>
            </tr>
            <tr>
                <th><label for="wedding_time">Ceremony Time</label></th>
                <td><input type="time" id="wedding_time" name="wedding_time" value="<?= esc_attr(get_option('wedding_time', '14:00')); ?>" class="regular-text"></td>
            </tr>
        </table>

        <h2>🖼️ Main Image</h2>
        <table class="form-table">
            <tr>
                <th><label for="wedding_hero_image">Background Image URL</label></th>
                <td>
                    <input type="url" id="wedding_hero_image" name="wedding_hero_image" value="<?= esc_attr(get_option('wedding_hero_image', '')); ?>" class="large-text" placeholder="https://example.com/image.jpg">
                    <p class="description">Upload image via Media Library and paste URL here</p>
                </td>
            </tr>
            <tr>
                <th><label for="wedding_hero_subtitle">Subtitle</label></th>
                <td>
                    <input type="text" id="wedding_hero_subtitle" name="wedding_hero_subtitle" value="<?= esc_attr(get_option('wedding_hero_subtitle', 'Together with their families')); ?>" class="large-text">
                </td>
            </tr>
            <tr>
                <th><label for="wedding_hero_title">Title</label></th>
                <td>
                    <input type="text" id="wedding_hero_title" name="wedding_hero_title" value="<?= esc_attr(get_option('wedding_hero_title', 'Request the pleasure of your company')); ?>" class="large-text">
                </td>
            </tr>
        </table>

        <h2>💑 Couple Names</h2>
        <table class="form-table">
            <tr>
                <th><label for="wedding_couple_name1">Partner 1</label></th>
                <td><input type="text" id="wedding_couple_name1" name="wedding_couple_name1" value="<?= esc_attr(get_option('wedding_couple_name1', 'Emma')); ?>" class="regular-text"></td>
            </tr>
            <tr>
                <th><label for="wedding_couple_name2">Partner 2</label></th>
                <td><input type="text" id="wedding_couple_name2" name="wedding_couple_name2" value="<?= esc_attr(get_option('wedding_couple_name2', 'John')); ?>" class="regular-text"></td>
            </tr>
        </table>

        <h2>📍 City Hall</h2>
        <table class="form-table">
            <tr>
                <th><label for="wedding_cityHall_name">cityHall Name</label></th>
                <td><input type="text" id="wedding_cityHall_name" name="wedding_cityHall_name" value="<?= esc_attr(get_option('wedding_cityHall_name', 'Eiffel Tower')); ?>" class="regular-text"></td>
            </tr>
            <tr>
                <th><label for="wedding_cityHall_description">cityHall description</label></th>
                <td><input type="text" id="wedding_cityHall_description" name="wedding_cityHall_description" value="<?= esc_attr(get_option('wedding_cityHall_description', 'Short text to motivate guest to come to the city hall')); ?>" class="regular-text"></td>
            </tr>
            <tr>
                <th><label for="wedding_cityHall_address">Full Address</label></th>
                <td><textarea id="wedding_cityHall_address" name="wedding_cityHall_address" rows="3" class="large-text"><?= esc_textarea(get_option('wedding_cityHall_address', 'Champ de Mars, 5 avenue Anatole France, 75007 Paris, France')); ?></textarea></td>
            </tr>
            <tr>
                <th><label for="wedding_cityHall_getting_there">Getting There</label></th>
                <td>
                    <input type="text" id="wedding_cityHall_getting_there1" name="wedding_cityHall_getting_there1" value="<?= esc_attr(get_option('wedding_cityHall_getting_there1', 'Champ de Mars, 5 avenue Anatole France, 75007 Paris, France')); ?>" class="regular-text"><br><br>
                    <input type="text" id="wedding_cityHall_getting_there2" name="wedding_cityHall_getting_there2" value="<?= esc_attr(get_option('wedding_cityHall_getting_there2', 'Champ de Mars, 5 avenue Anatole France, 75007 Paris, France')); ?>" class="regular-text"><br><br>
                    <input type="text" id="wedding_cityHall_getting_there3" name="wedding_cityHall_getting_there3" value="<?= esc_attr(get_option('wedding_cityHall_getting_there3', 'Champ de Mars, 5 avenue Anatole France, 75007 Paris, France')); ?>" class="regular-text">
                </td>
            </tr>
        </table>

        <h2>📍 Venue</h2>
        <table class="form-table">
            <tr>
                <th><label for="wedding_venue_name">Venue Name</label></th>
                <td><input type="text" id="wedding_venue_name" name="wedding_venue_name" value="<?= esc_attr(get_option('wedding_venue_name', 'Eiffel Tower')); ?>" class="regular-text"></td>
            </tr>
            <tr>
                <th><label for="wedding_venue_description">venue description</label></th>
                <td><input type="text" id="wedding_venue_description" name="wedding_venue_description" value="<?= esc_attr(get_option('wedding_venue_description', 'Short text to motivate guest to come to the venue')); ?>" class="regular-text"></td>
            </tr>
            <tr>
                <th><label for="wedding_venue_address">Full Address</label></th>
                <td><textarea id="wedding_venue_address" name="wedding_venue_address" rows="3" class="large-text"><?= esc_textarea(get_option('wedding_venue_address', 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France')); ?></textarea></td>
            </tr>
            <tr>
                <th><label for="wedding_venue_getting_there">Getting There</label></th>
                <td><input type="text" id="wedding_venue_getting_there1" name="wedding_venue_getting_there1" value="<?= esc_attr(get_option('wedding_venue_getting_there1', 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France')); ?>" class="regular-text"><br><br>
                <input type="text" id="wedding_venue_getting_there2" name="wedding_venue_getting_there2" value="<?= esc_attr(get_option('wedding_venue_getting_there2', 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France')); ?>" class="regular-text"><br><br>
                <input type="text" id="wedding_venue_getting_there3" name="wedding_venue_getting_there3" value="<?= esc_attr(get_option('wedding_venue_getting_there3', 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France')); ?>" class="regular-text"></td>
            </tr>
        </table>

        <h2>⌚ Timeline </h2>
        <table class="form-table">
            <tr>
                <th><label for="wedding_timeline_subtitle">Subtitle</label></th>
                <td><input type="text" id="wedding_timeline_subtitle" name="wedding_timeline_subtitle" value="<?= esc_attr(get_option('wedding_timeline_subtitle', 'The Schedule')); ?>" class="regular-text"></td>
            </tr>
            <tr>
                <th><label for="wedding_timeline_title">Title</label></th>
                <td><input type="text" id="wedding_timeline_title" name="wedding_timeline_title" value="<?= esc_attr(get_option('wedding_timeline_title', 'Timeline')); ?>" class="regular-text"></td>
            </tr>
            <tr>
                <th><label for="wedding_cityHall_name">City Hall Name</label></th>
                <td><input type="text" id="wedding_cityHall_name" name="wedding_cityHall_name" value="<?= esc_attr(get_option('wedding_cityHall_name', 'City Hall Name')); ?>" class="regular-text"></td>
            </tr>
            <tr>
                <th><label for="wedding_cityHall_shortname">City Hall Shortname</label></th>
                <td><input type="text" id="wedding_cityHall_shortname" name="wedding_cityHall_shortname" value="<?= esc_attr(get_option('wedding_cityHall_shortname', 'City Hall shortname')); ?>" class="regular-text"></td>
            </tr>
            <tr>
                <th><label for="wedding_photo_time">Wedding Photos</label></th>
                <td><input type="text" id="wedding_photo_time" name="wedding_photo_time" value="<?= esc_attr(get_option('wedding_photo_time', '16:00')); ?>" class="regular-text"></td>
            </tr>
            <tr>
                <th><label for="wedding_photo_name">Wedding Photos title</label></th>
                <td><input type="text" id="wedding_photo_name" name="wedding_photo_name" value="<?= esc_attr(get_option('wedding_photo_name', 'Photos & Cocktails')); ?>" class="regular-text"></td>
            </tr>
            <tr>
                <th><label for="wedding_photo_shortname">Wedding Photos Shortname</label></th>
                <td><input type="text" id="wedding_photo_shortname" name="wedding_photo_shortname" value="<?= esc_attr(get_option('wedding_photo_shortname', 'Garden Terrace')); ?>" class="regular-text"></td>
            </tr>
            <tr>
                <th><label for="wedding_dinner_time">Wedding Dinner</label></th>
                <td><input type="text" id="wedding_dinner_time" name="wedding_dinner_time" value="<?= esc_attr(get_option('wedding_dinner_time', '18:00')); ?>" class="regular-text"></td>
            </tr>
            <tr>
                <th><label for="wedding_dinner_name">Wedding Dinner title</label></th>
                <td><input type="text" id="wedding_dinner_name" name="wedding_dinner_name" value="<?= esc_attr(get_option('wedding_dinner_name', 'Dinner Reception')); ?>" class="regular-text"></td>
            </tr>
            <tr>
                <th><label for="wedding_dinner_shortname">Wedding Dinner Shortname</label></th>
                <td><input type="text" id="wedding_dinner_shortname" name="wedding_dinner_shortname" value="<?= esc_attr(get_option('wedding_dinner_shortname', 'Grand Ballroom')); ?>" class="regular-text"></td>
            </tr>
            <tr>
                <th><label for="wedding_dancing_time">Celebration</label></th>
                <td><input type="text" id="wedding_dancing_time" name="wedding_dancing_time" value="<?= esc_attr(get_option('wedding_dancing_time', '20:00')); ?>" class="regular-text"></td>
            </tr>
            <tr>
                <th><label for="wedding_dancing_name">Celebration title</label></th>
                <td><input type="text" id="wedding_dancing_name" name="wedding_dancing_name" value="<?= esc_attr(get_option('wedding_dancing_name', 'Dancing Reception')); ?>" class="regular-text"></td>
            </tr>
            <tr>
                <th><label for="wedding_dancing_shortname">Celebration Shortname</label></th>
                <td><input type="text" id="wedding_dancing_shortname" name="wedding_dancing_shortname" value="<?= esc_attr(get_option('wedding_dancing_shortname', 'Grand Ballroom')); ?>" class="regular-text"></td>
            </tr>
        </table>

        <h2>📜 Story</h2>
        <table class="form-table">
            <tr>
                <th><label for="wedding_our_story_subtitle">Subtitle</label></th>
                <td><input type="text" id="wedding_our_story_subtitle" name="wedding_our_story_subtitle" value="<?= esc_attr(get_option('wedding_our_story_subtitle', 'The highlights')); ?>" class="regular-text"></td>
            </tr>
            <tr>
                <th><label for="wedding_our_story_title">Title</label></th>
                <td><input type="text" id="wedding_our_story_title" name="wedding_our_story_title" value="<?= esc_attr(get_option('wedding_our_story_title', 'Our Story')); ?>" class="regular-text"></td>
            </tr>
        </table>
        
        <h2>📍 Location</h2>
        <table class="form-table">
            <tr>
                <th><label for="wedding_location_subtitle">Subtitle</label></th>
                <td><input type="text" id="wedding_location_subtitle" name="wedding_location_subtitle" value="<?= esc_attr(get_option('wedding_location_subtitle', 'Find Your Way')); ?>" class="regular-text"></td>
            </tr>
            <tr>
                <th><label for="wedding_location_title">Title</label></th>
                <td><input type="text" id="wedding_location_title" name="wedding_location_title" value="<?= esc_attr(get_option('wedding_location_title', 'Location')); ?>" class="regular-text"></td>
            </tr>
        </table>
        
        <h2>📍 Formulaire</h2>
        <table class="form-table">
            <tr>
                <th><label for="wedding_form_subtitle">Subtitle</label></th>
                <td><input type="text" id="wedding_form_subtitle" name="wedding_form_subtitle" value="<?= esc_attr(get_option('wedding_form_subtitle', 'We Hope You Can Make It')); ?>" class="regular-text"></td>
            </tr>
            <tr>
                <th><label for="wedding_form_title">Title</label></th>
                <td><input type="text" id="wedding_form_title" name="wedding_form_title" value="<?= esc_attr(get_option('wedding_form_title', 'RSVP')); ?>" class="regular-text"></td>
            </tr>
        </table>
        
        <h2>🔐 Access Codes</h2>
        <table class="form-table">
            <tr>
                <th><label for="wedding_access_codes">Valid Codes</label></th>
                <td>
                    <textarea id="wedding_access_codes" name="wedding_access_codes" rows="6" class="large-text" placeholder="LOVE2025&#10;WEDDING&#10;TEST123"><?= esc_textarea(get_option('wedding_access_codes', "LOVE2025\nWEDDING\nTEST123\nEMMA2025\nJohn2025")); ?></textarea>
                    <p class="description">One code per line. Codes are case-insensitive.</p>
                </td>
            </tr>
        </table>

        <?php submit_button('Save Settings'); ?>
    </form>
</div>
