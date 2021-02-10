module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: '@import "@/scss/baseline.scss";'
      }
    }
  }
};
