/* global require, module */

var Angular2App = require('angular-cli/lib/broccoli/angular2-app');

module.exports = function(defaults) {
  return new Angular2App(defaults, {
    vendorNpmFiles: [
      'systemjs/dist/system-polyfills.js',
      'systemjs/dist/system.src.js',
      'zone.js/dist/*.js',
      'es6-shim/es6-shim.js',
      'reflect-metadata/*.js',
      'rxjs/**/*.js',
      '@angular/**/*.js',
      'jquery/dist/jquery.js',
      'semantic-ui-css/semantic.min.{js,css}',
      'semantic-ui-css/themes/**/*',
      'ui-router-ng2/_bundles/ui-router-ng2.min.js',
      'jquery-ui-dist/jquery-ui.min.{js,css}',
      'moment/min/moment.min.js',
      'highcharts/highcharts.js',
      'highcharts/highcharts-more.js',
      'highcharts/css/*'
    ]
  });
};
