const src = 'source/';
const dev = 'build/';
const dpl = 'deploy/';
const rep = 'reports/';

const config = {
  src: src,
  dev: dev,
  dpl: dpl,
  rep: rep,

  demo: true,
  //these are not used while demo: true is set
  index: 'index.html',
  templateData: src + 'templates/data.json',
  frontendData: src + 'data/**/*.json',

  hippie: {
    brand: 'hippie',
    titlePrefix: ' - HIPPIE',
    pageBase: './'
  }
}

module.exports = config;