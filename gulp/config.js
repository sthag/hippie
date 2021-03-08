const src = 'source/';
const dest = 'build/';

const config = {
  src: src,
  dest: dest,

  demo: true,
  
  index: 'index.html',

  templateData: src + 'templates/data.json',
  frontendData: src + 'data/**/*.json',

  hippie: {
    brand: 'hippie',
    titlePrefix: ' - HIPPIE',
    pageBase: './',
    jsFile: 'main',
    jsonFile: 'db'
  }
}

module.exports = config;