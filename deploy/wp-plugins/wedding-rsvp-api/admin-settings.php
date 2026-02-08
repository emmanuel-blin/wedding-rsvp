<style>
.wedding-settings-wrap .nav-tab-wrapper {
    margin-bottom: 20px;
}
.wedding-settings-wrap .nav-tab {
    cursor: pointer;
}
.wedding-settings-wrap .tab-panel {
    display: none;
    background: #fff;
    padding: 20px;
    border: 1px solid #c3c4c7;
    border-top: none;
}
.wedding-settings-wrap .tab-panel.active {
    display: block;
}
.wedding-settings-wrap .section-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 20px 0 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e0e0e0;
}
.wedding-settings-wrap .section-header:first-child {
    margin-top: 0;
}
.wedding-settings-wrap .section-icon {
    font-size: 20px;
}
.wedding-settings-wrap .form-table th {
    width: 200px;
}
.wedding-settings-wrap .save-btn-wrapper {
    position: sticky;
    bottom: 0;
    background: #f0f0f1;
    padding: 15px 0;
    margin-top: 30px;
    border-top: 1px solid #c3c4c7;
}
.wedding-settings-wrap .image-preview {
    max-width: 300px;
    margin-top: 10px;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
</style>

<div class="wrap wedding-settings-wrap">
    <h1>💒 Wedding Settings</h1>

    <h2 class="nav-tab-wrapper">
        <a class="nav-tab active" data-tab="general">General</a>
        <a class="nav-tab" data-tab="venues">Venues</a>
        <a class="nav-tab" data-tab="timeline">Timeline</a>
        <a class="nav-tab" data-tab="content">Content</a>
        <a class="nav-tab" data-tab="rsvp">RSVP</a>
    </h2>

    <form method="post" action="options.php">
        <?php settings_fields('wedding_settings'); ?>

        <div id="tab-general" class="tab-panel active">
            <div class="section-header">
                <span class="section-icon">📅</span>
                <h3>Date & Time</h3>
            </div>
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

            <div class="section-header">
                <span class="section-icon">💑</span>
                <h3>Couple Names</h3>
            </div>
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

            <div class="section-header">
                <span class="section-icon">🖼️</span>
                <h3>Hero Image</h3>
            </div>
            <table class="form-table">
                <tr>
                    <th><label for="wedding_hero_image">Background Image URL</label></th>
                    <td>
                        <input type="url" id="wedding_hero_image" name="wedding_hero_image" value="<?= esc_attr(get_option('wedding_hero_image', '')); ?>" class="large-text" placeholder="https://example.com/image.jpg">
                        <p class="description">Upload image via Media Library and paste URL here</p>
                        <?php $hero_url = get_option('wedding_hero_image', ''); ?>
                        <?php if ($hero_url): ?>
                            <img src="<?= esc_url($hero_url); ?>" class="image-preview" alt="Hero preview">
                        <?php endif; ?>
                    </td>
                </tr>
                <tr>
                    <th><label for="wedding_hero_subtitle">Subtitle</label></th>
                    <td><input type="text" id="wedding_hero_subtitle" name="wedding_hero_subtitle" value="<?= esc_attr(get_option('wedding_hero_subtitle', 'Together with their families')); ?>" class="large-text"></td>
                </tr>
                <tr>
                    <th><label for="wedding_hero_title">Title</label></th>
                    <td><input type="text" id="wedding_hero_title" name="wedding_hero_title" value="<?= esc_attr(get_option('wedding_hero_title', 'Request the pleasure of your company')); ?>" class="large-text"></td>
                </tr>
            </table>
        </div>

        <div id="tab-venues" class="tab-panel">
            <div class="section-header">
                <span class="section-icon">🏛️</span>
                <h3>City Hall</h3>
            </div>
            <table class="form-table">
                <tr>
                    <th><label for="wedding_cityHall_name">Name</label></th>
                    <td><input type="text" id="wedding_cityHall_name" name="wedding_cityHall_name" value="<?= esc_attr(get_option('wedding_cityHall_name', 'Eiffel Tower')); ?>" class="regular-text"></td>
                </tr>
                <tr>
                    <th><label for="wedding_cityHall_description">Description</label></th>
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

            <div class="section-header">
                <span class="section-icon">🎉</span>
                <h3>Venue / Reception</h3>
            </div>
            <table class="form-table">
                <tr>
                    <th><label for="wedding_venue_name">Venue Name</label></th>
                    <td><input type="text" id="wedding_venue_name" name="wedding_venue_name" value="<?= esc_attr(get_option('wedding_venue_name', 'Eiffel Tower')); ?>" class="regular-text"></td>
                </tr>
                <tr>
                    <th><label for="wedding_venue_description">Description</label></th>
                    <td><input type="text" id="wedding_venue_description" name="wedding_venue_description" value="<?= esc_attr(get_option('wedding_venue_description', 'Short text to motivate guest to come to the venue')); ?>" class="regular-text"></td>
                </tr>
                <tr>
                    <th><label for="wedding_venue_address">Full Address</label></th>
                    <td><textarea id="wedding_venue_address" name="wedding_venue_address" rows="3" class="large-text"><?= esc_textarea(get_option('wedding_venue_address', 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France')); ?></textarea></td>
                </tr>
                <tr>
                    <th><label for="wedding_venue_getting_there">Getting There</label></th>
                    <td>
                        <input type="text" id="wedding_venue_getting_there1" name="wedding_venue_getting_there1" value="<?= esc_attr(get_option('wedding_venue_getting_there1', 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France')); ?>" class="regular-text"><br><br>
                        <input type="text" id="wedding_venue_getting_there2" name="wedding_venue_getting_there2" value="<?= esc_attr(get_option('wedding_venue_getting_there2', 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France')); ?>" class="regular-text"><br><br>
                        <input type="text" id="wedding_venue_getting_there3" name="wedding_venue_getting_there3" value="<?= esc_attr(get_option('wedding_venue_getting_there3', 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France')); ?>" class="regular-text">
                    </td>
                </tr>
            </table>
        </div>

        <div id="tab-timeline" class="tab-panel">
            <div class="section-header">
                <span class="section-icon">📅</span>
                <h3>Timeline Header</h3>
            </div>
            <table class="form-table">
                <tr>
                    <th><label for="wedding_timeline_subtitle">Subtitle</label></th>
                    <td><input type="text" id="wedding_timeline_subtitle" name="wedding_timeline_subtitle" value="<?= esc_attr(get_option('wedding_timeline_subtitle', 'The Schedule')); ?>" class="regular-text"></td>
                </tr>
                <tr>
                    <th><label for="wedding_timeline_title">Title</label></th>
                    <td><input type="text" id="wedding_timeline_title" name="wedding_timeline_title" value="<?= esc_attr(get_option('wedding_timeline_title', 'Timeline')); ?>" class="regular-text"></td>
                </tr>
            </table>

            <div class="section-header">
                <span class="section-icon">💒</span>
                <h3>Ceremony</h3>
            </div>
            <table class="form-table">
                <tr>
                    <th><label for="wedding_cityHall_shortname">Shortname</label></th>
                    <td><input type="text" id="wedding_cityHall_shortname" name="wedding_cityHall_shortname" value="<?= esc_attr(get_option('wedding_cityHall_shortname', 'City Hall')); ?>" class="regular-text"></td>
                </tr>
            </table>

            <div class="section-header">
                <span class="section-icon">📸</span>
                <h3>Photos & Cocktails</h3>
            </div>
            <table class="form-table">
                <tr>
                    <th><label for="wedding_photo_time">Time</label></th>
                    <td><input type="time" id="wedding_photo_time" name="wedding_photo_time" value="<?= esc_attr(get_option('wedding_photo_time', '16:00')); ?>" class="regular-text"></td>
                </tr>
                <tr>
                    <th><label for="wedding_photo_name">Title</label></th>
                    <td><input type="text" id="wedding_photo_name" name="wedding_photo_name" value="<?= esc_attr(get_option('wedding_photo_name', 'Photos & Cocktails')); ?>" class="regular-text"></td>
                </tr>
                <tr>
                    <th><label for="wedding_photo_shortname">Shortname</label></th>
                    <td><input type="text" id="wedding_photo_shortname" name="wedding_photo_shortname" value="<?= esc_attr(get_option('wedding_photo_shortname', 'Garden Terrace')); ?>" class="regular-text"></td>
                </tr>
            </table>

            <div class="section-header">
                <span class="section-icon">🍽️</span>
                <h3>Dinner</h3>
            </div>
            <table class="form-table">
                <tr>
                    <th><label for="wedding_dinner_time">Time</label></th>
                    <td><input type="time" id="wedding_dinner_time" name="wedding_dinner_time" value="<?= esc_attr(get_option('wedding_dinner_time', '18:00')); ?>" class="regular-text"></td>
                </tr>
                <tr>
                    <th><label for="wedding_dinner_name">Title</label></th>
                    <td><input type="text" id="wedding_dinner_name" name="wedding_dinner_name" value="<?= esc_attr(get_option('wedding_dinner_name', 'Dinner Reception')); ?>" class="regular-text"></td>
                </tr>
                <tr>
                    <th><label for="wedding_dinner_shortname">Shortname</label></th>
                    <td><input type="text" id="wedding_dinner_shortname" name="wedding_dinner_shortname" value="<?= esc_attr(get_option('wedding_dinner_shortname', 'Grand Ballroom')); ?>" class="regular-text"></td>
                </tr>
            </table>

            <div class="section-header">
                <span class="section-icon">💃</span>
                <h3>Celebration / Dancing</h3>
            </div>
            <table class="form-table">
                <tr>
                    <th><label for="wedding_dancing_time">Time</label></th>
                    <td><input type="time" id="wedding_dancing_time" name="wedding_dancing_time" value="<?= esc_attr(get_option('wedding_dancing_time', '20:00')); ?>" class="regular-text"></td>
                </tr>
                <tr>
                    <th><label for="wedding_dancing_name">Title</label></th>
                    <td><input type="text" id="wedding_dancing_name" name="wedding_dancing_name" value="<?= esc_attr(get_option('wedding_dancing_name', 'Dancing Reception')); ?>" class="regular-text"></td>
                </tr>
                <tr>
                    <th><label for="wedding_dancing_shortname">Shortname</label></th>
                    <td><input type="text" id="wedding_dancing_shortname" name="wedding_dancing_shortname" value="<?= esc_attr(get_option('wedding_dancing_shortname', 'Grand Ballroom')); ?>" class="regular-text"></td>
                </tr>
            </table>
        </div>

        <div id="tab-content" class="tab-panel">
            <div class="section-header">
                <span class="section-icon">📜</span>
                <h3>Our Story</h3>
            </div>
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

            <div class="section-header">
                <span class="section-icon">📍</span>
                <h3>Location</h3>
            </div>
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

            <div class="section-header">
                <span class="section-icon">🛏️</span>
                <h3>Accommodation</h3>
            </div>
            <table class="form-table">
                <tr>
                    <th><label for="wedding_sleep_subtitle">Subtitle</label></th>
                    <td><input type="text" id="wedding_sleep_subtitle" name="wedding_sleep_subtitle" value="<?= esc_attr(get_option('wedding_sleep_subtitle', 'Need a Place to Stay')); ?>" class="regular-text"></td>
                </tr>
                <tr>
                    <th><label for="wedding_sleep_title">Title</label></th>
                    <td><input type="text" id="wedding_sleep_title" name="wedding_sleep_title" value="<?= esc_attr(get_option('wedding_sleep_title', 'Accommodation')); ?>" class="regular-text"></td>
                </tr>
                <tr>
                    <th><label for="wedding_sleep_description">Description</label></th>
                    <td>
                        <textarea id="wedding_sleep_description" name="wedding_sleep_description" rows="4" class="large-text"><?= esc_textarea(get_option('wedding_sleep_description', "Looking for a place to stay? We've partnered with local accommodations to make your visit comfortable. Book your stay near the venue using the links below.")); ?></textarea>
                        <p class="description">This text will appear above the booking links. The venue name is used to pre-filter search results.</p>
                    </td>
                </tr>
            </table>
        </div>

        <div id="tab-rsvp" class="tab-panel">
            <div class="section-header">
                <span class="section-icon">📝</span>
                <h3>Form</h3>
            </div>
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

            <div class="section-header">
                <span class="section-icon">🔐</span>
                <h3>Access Codes</h3>
            </div>
            <table class="form-table">
                <tr>
                    <th><label for="wedding_access_codes">Valid Codes</label></th>
                    <td>
                        <textarea id="wedding_access_codes" name="wedding_access_codes" rows="6" class="large-text" placeholder="LOVE2025&#10;WEDDING&#10;TEST123"><?= esc_textarea(get_option('wedding_access_codes', "LOVE2025\nWEDDING\nTEST123\nEMMA2025\nJohn2025")); ?></textarea>
                        <p class="description">One code per line. Codes are case-insensitive.</p>
                    </td>
                </tr>
            </table>
        </div>

        <div class="save-btn-wrapper">
            <?php submit_button('Save Settings'); ?>
        </div>
    </form>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.wedding-settings-wrap .nav-tab');
    const panels = document.querySelectorAll('.wedding-settings-wrap .tab-panel');

    tabs.forEach(function(tab) {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.dataset.tab;

            tabs.forEach(function(t) {
                t.classList.remove('active');
            });
            this.classList.add('active');

            panels.forEach(function(p) {
                p.classList.remove('active');
            });
            document.getElementById('tab-' + target).classList.add('active');

            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        });
    });

    const hash = window.location.hash;
    if (hash && hash.startsWith('#tab-')) {
        const tabName = hash.replace('#tab-', '');
        const tab = document.querySelector('.wedding-settings-wrap .nav-tab[data-tab="' + tabName + '"]');
        if (tab) {
            tab.click();
        }
    }
});
</script>
