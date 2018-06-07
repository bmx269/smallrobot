/* eslint-env node */
'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    gzip: {
      enabled: true,
      extensions: ['js', 'css', 'svg'],
      keepUncompressed: true
    },
    'autoprefixer': {
      browsers: [
        'ie 11',
        'last 2 Chrome versions',
        'last 2 Firefox versions',
        'last 2 Edge versions',
        'last 2 Safari versions',
        'last 2 ios versions',
        'last 2 ChromeAndroid versions'
      ],
      cascade: false
    },
    'ember-cli-babel': {
      includePolyfill: true
    },
    'ember-cli-image-transformer': {
      images: [
        {
          inputFilename: 'public/img/icon.png',
          outputFileName: 'appicon-',
          convertTo: 'png',
          destination: 'assets/icons/',
          sizes: [32, 192, 280, 512]
        },
        {
          inputFilename: 'public/img/splash.png',
          outputFileName: 'appsplash-',
          convertTo: 'png',
          destination: 'assets/splashes/',
          sizes: [512]
        }
      ]
    },
    'ember-service-worker': {
      versionStrategy: 'every-build'
    },
    'asset-cache': {
      include: [
        'assets/**/*',
        'favicons/**/*',
        'fonts/**/*',
        'img/**/*'
      ],
      version: '8',
      requestMode: 'cors'
    },
    'esw-cache-first': {
      patterns: [
        '/assets/(.+)',
        '/img/(.+)'
      ]
    },
    'esw-cache-fallback': {
      patterns: [
        '/api/(.+)'
      ],
    },
    'esw-prember': {
      version: '8'
    },
    'prember': {
      baseRoot: 'https://smallrobot.co',
      urls: [
        '/',
        '/consulting',
        '/development',
        '/support',
        '/contact',
        '/about',
        '/ideas',
      ]
    }
  });
  return app.toTree();
};
