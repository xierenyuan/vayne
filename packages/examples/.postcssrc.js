// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  "plugins": {
    // to edit target browsers: use "browserslist" field in package.json
    // "postcss-import": {},
    "autoprefixer": {
      browsers: ['last 2 versions', 'Android >= 4.0', 'iOS >= 6']
    },
    "@vayne/postcss-px2rem": {
      baseDpr: 1,
      remUnit: 37.5
    }
  }
}
