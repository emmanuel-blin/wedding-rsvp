<?php

/**
 * Color themes picked in Wedding -> Settings -> General. Color keys are the frontend role tokens
 * (--color-<key>); roles and the contrast checks a new palette must pass: README "Color Theme".
 */
function wedding_theme_palettes() {
    return [
        'classic' => [
            'name' => 'Classic Bordeaux',
            'colors' => ['primary' => '#800020', 'onPrimary' => '#f7e7ce', 'accent' => '#d4af37', 'secondary' => '#a35663', 'surface' => '#fdfaf5'],
        ],
        'sage' => [
            'name' => 'Sage Garden',
            'colors' => ['primary' => '#2f4a3a', 'onPrimary' => '#ece6cf', 'accent' => '#d6c38c', 'secondary' => '#6f6435', 'surface' => '#f7f5ec'],
        ],
        'midnight' => [
            'name' => 'Midnight Blush',
            'colors' => ['primary' => '#1f2a44', 'onPrimary' => '#f6e3e0', 'accent' => '#d9a6a6', 'secondary' => '#9b5560', 'surface' => '#fbf8f6'],
        ],
        'terracotta' => [
            'name' => 'Terracotta Sun',
            'colors' => ['primary' => '#7f3520', 'onPrimary' => '#f6e4cc', 'accent' => '#e6b779', 'secondary' => '#9c4f35', 'surface' => '#fcf7f1'],
        ],
        'black_tie' => [
            'name' => 'Black Tie',
            'colors' => ['primary' => '#1c1c1c', 'onPrimary' => '#eceef1', 'accent' => '#c5c9cf', 'secondary' => '#5b6270', 'surface' => '#f9f9f8'],
        ],
        'dusty_blue' => [
            'name' => 'Dusty Blue',
            'colors' => ['primary' => '#36506a', 'onPrimary' => '#e3ebf2', 'accent' => '#e6c3b5', 'secondary' => '#97564c', 'surface' => '#f7f9fb'],
        ],
    ];
}

/**
 * Only known palette ids can be saved (anything else falls back to Classic)
 */
function wedding_sanitize_theme($value) {
    return array_key_exists($value, wedding_theme_palettes()) ? $value : 'classic';
}

/**
 * Active palette for the API: ['id' => ..., 'name' => ..., 'colors' => [...]]
 */
function wedding_get_theme() {
    $palettes = wedding_theme_palettes();
    $id = wedding_sanitize_theme(get_option('wedding_theme', 'classic'));
    return ['id' => $id] + $palettes[$id];
}
