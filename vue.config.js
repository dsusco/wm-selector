module.exports = {
  chainWebpack: (config) => {
    var
      options = {
        data: "@import '@/scss/baseline.scss';",
        sourceMap: false
      };

    //config.module.rule('scss').oneOf('vue-modules').use('sass-loader').options(options);
    config.module.rule('scss').oneOf('vue').use('sass-loader').options(options);
    //config.module.rule('scss').oneOf('normal-modules').use('sass-loader').options(options);
    //config.module.rule('scss').oneOf('normal').use('sass-loader').options(options);
  }
}
