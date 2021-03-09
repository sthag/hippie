// Setup
// -----------------------------------------------------------------------------
import { hippie } from './config.js';

// This is called everytime
function setup() {
  'use strict';

  console.group('Document information');
  console.info('\n', config.brand, '\n\n');
  console.info('\n', hippie.brand, '\n\n');
  console.info('HTML:', hippie.screen, '\nBODY:', hippie.body);
  console.groupEnd();
  if (debugOn) {
    console.group('Debug information');
    console.dir(hippie);
    console.groupEnd();
  }

  // WANNABE MODULE Mouse over effect
  // With CSS only
  if ($('#js_mob').length && viewHover) {
    $('#js_mob').addClass('mouse_over');
  }
  // if (viewHover) {
  // 	$('body').prepend('<div id="js_mob" class="mouse_over"></div>');
  // }
  // With JS
}
