# Deprecated stuff

## Packages

```
"gulp-ruby-sass": "^2.1.1",
"gulp-cssnano": "^2.1.3",
"gulp-rename": "^1.2.3",
"gulp-changed": "^3.2.0",
"gulp-newer": "^1.4.0",
"gulp-useref": "^3.1.5",
```

## Style

```
The config file is intended to allow users to quickly redefine core elements of the design
that will cascade throughout the css to get your design up and running FAST!

For instruction, please see https://github.com/Anotheruiguy/toadstool/blob/master/sass/doc-src/config.md

///// Typography configuration///////
-----------------------------------------------------------------------------
$font_size: 12;

$heading_1: 46;
$heading_2: 32;
$heading_3: 28;
$heading_4: 18;
$heading_5: 18;
$heading_6: 18;

$line: $font_size * 1.5;

$small_point_size: 10;
$large_point_size: 14;

$primary_font_family: #{"Helvetica Neue", Arial, sans-serif};
$secondary_font_family: #{"Helvetica Neue", Arial, sans-serif};
$heading_font_family: #{"Helvetica Neue", Arial, sans-serif};

$icon_font_alpha: #{'ico-fonts'};

///// Default webfont directory///////
-----------------------------------------------------------------------------
$webfont_directory: "/fonts/";

///// default image directory ///////
-----------------------------------------------------------------------------
In Sinatra, the images folder resides in the public directory.  This directory is not made publically accessible,
so simply referencing the images directory will be fine.
$imgDir: "/images/";

///// OOCSS generic base colors///////
-----------------------------------------------------------------------------
Red, green, yellow, blue, accent and black is not law, but a common theme in most designs.
Using Toadstool, all you need to do is edit these 6 hex values and everything else is created
by magic, unicorns and fairy dust!

$alpha_primary:   #5a2e2e;        // red
$bravo_primary:   #3e4147;        // green
$charlie_primary: #fffedf;        // yellow
$delta_primary:   #2a2c31;        // blue
$echo_primary:    #dfba69;        // accent

$alpha_gray:      #333;           //black

///// Toadstool color math ///////
-----------------------------------------------------------------------------
Local color functions to create default color palette
@import "color/color_math";
@import "color/grayscale_math";
@import "color/color_defaults";

///// Grid configuration ///////
-----------------------------------------------------------------------------
setting default units of measurement for Toadstool grid solution
$grid_type:                  12;             // sets default column grid
$grid_uom:                   percent;        // use either ``em`` or ``percent``
$grid_padding_l:             0;              // sets default left/right padding inside grid block
$grid_padding_r:             0;              // sets default left/right padding inside grid block
$grid_padding_tb:            0;              // sets default top/bottom padding inside grid block
$grid_border:                0;              // sets default border width on all grid blocks
$grid_child:                 none;           // sets parent child relationship between grid blocks
$grid_align:                 default;        // by default grids float left. Optional argument is ``center``
$col_base:                   10;             // equal to 10px in the standard 960.gs
$col_gutter:                 $col_base * 2;  // sets default grid gutter width
$grid_960:                   960 / 100%;     // grid math for percentages



///// HTML 5 feature colors ///////
-----------------------------------------------------------------------------
used with the `ins` tag
http://www.w3schools.com/tags/tag_ins.asp
$ins_color:                            $charlie_color;

used with the `mark` tag
http://www.w3schools.com/html5/tag_mark.asp
$mark_color:                           $charlie_color;

webkit tap highlight color
$webkit_tap_hightlight:                $delta_color_bravo;

overrides the default content selection color in the browser
$selection_color:                      $charlie_color;
$selection_text_color:                 $primary_text;



///// Config defaults for forms ///////
-----------------------------------------------------------------------------
$alert_back_color:        $alpha_color;

$input_disabled:                $bravo_gray;
$input_disabled_bkg:            lighten($input_disabled, 75%);
$input_disabled_border:         lighten($input_disabled, 50%);
$input_disabled_text:           lighten($input_disabled, 50%);

$form_field_back_color:   $brightest_color;
$form_field_focus_color:        $brightest_color;
$form_field_fail_bkg:           $alpha_color_juliet;

$form_field_border:             $charlie_gray;
$form_field_border_fail:        $alpha_color_echo;
$form_field_focus_border_color: $charlie_gray;

$form_field_text_fail:          $alpha_color_echo;
$form_label_color:              $alpha_gray;
$optional_field_text_color:     $delta_gray;
$instructional_text:            $charlie_gray;
$placeholder_text:              $hotel_gray;
$inline_alert_bkg_color:        $alpha_color_delta;
$inline_alert_text_color:       $brightest_color;

Non-color defaults (currently not represented in the SG view)
---------------------------------------------------------
$form_field_border_radius:      $standard_round_corner;
$form_field_text:               $primary_text;
$form_field_height:             35;
$form_field_padding:            6;
$form_label_weight:             bold;
$form_label_lineheight:         20;
$inline_alert_lineheight:       30;
$inline_alert_left_padding:     12;
$inline_alert_weight:           bold;
$inline_alert_top_margin:       12;
$inline_alert_border_width:     1;



///// Config defaults for buttons ///////
-----------------------------------------------------------------------------
$button-color:  $delta-color;
$button-text-color: $brightest_color;
$button-line-height: 32;
$button-border-radius: 3;
$button-padding: 20;
$button-font-size: 18;
$button-weight: bold;
$button-text-shadow: true;
$button-box-shadow: true;

///// Config defaults for ``standard_rounded_border`` mixin ///////
-----------------------------------------------------------------------------
$standard_round_corner:                3;                // sets default border radius
$standard_corner_width:                1px;              // sets default border width
$standard_border_color:                $border_color;    // sets default border color

///// Config defaults for ``standard_block_spacing`` mixin ///////
-----------------------------------------------------------------------------
$default_block_spacing:                20;               // sets margin-bottom

///// Config defaults for site border style ///////
-----------------------------------------------------------------------------
$standard_border_style:                solid;

///// Config defaults for ``standard_hr`` mixin ///////
-----------------------------------------------------------------------------
$standard_hr_spacing:                  40;               // sets padding and margin bottom
$standard_hr_color:                    $delta_gray;
$standard_hr_width:                    1px;

///// Config values for all default shadows ///////
-----------------------------------------------------------------------------
$h-shadow:                             0;                // horizontal shadow settings
$v-shadow:                             2;                // vertical shaddow settings
$blur:                                 3;                // blur settings

$inset_color:                          $shadow_color;    // for use with ``dual_box_shadow`` mixin
$ih-shadow:                            0;                // inset horizontal shadow settings
$iv-shadow:                            2;                // inset vertical shaddow settings
$is-shadow:                            2;                // inset spread shaddow settings
$iblur:                                3;                // inset blur settings
```
