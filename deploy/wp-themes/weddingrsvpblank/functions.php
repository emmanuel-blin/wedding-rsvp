<?php

 if ( ! defined( 'ABSPATH' ) ) {
     exit; // Exit if accessed directly
 }

 // Allow SVG
function add_file_types_to_uploads($file_types){
   $new_filetypes = array();
   $new_filetypes['svg'] = 'image/svg+xml';
   $file_types = array_merge($file_types, $new_filetypes );
   return $file_types;
   }

   add_filter('upload_mimes', 'add_file_types_to_uploads');

// Add thumbnail support
if (function_exists( 'add_theme_support' )) {
      add_theme_support( 'post-thumbnails' );
   }