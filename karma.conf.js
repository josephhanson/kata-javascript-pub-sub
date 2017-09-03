module.exports = function(config) {
  config.set({
    basePath: './',
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      // javascript application files
      'src/**/*.js',

      // javascript test files
      'test/**/*.spec.js'
    ],

    autoWatch: true,
    singleRun: false,
    browsers: ['PhantomJS']
  });
};
