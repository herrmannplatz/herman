module.exports = function(grunt) {

  var srcFiles = [
    'src/utils/polyfill.js',
    'src/herman.js',
    'src/render/*.js',
    'src/math/*.js',
    'src/tween/*.js',
    'src/scene/*.js',
    'src/audio/*.js',
    'src/experimental/*.js'
  ];

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      build: ['src/**/*.js']
    },

    concat: {
      build: {
        src: srcFiles,
        dest: 'build/<%= pkg.name %>.js'
      }
    },

    yuidoc: {
      release: {
        name: '<%= pkg.name %>',
        description: '<%= pkg.description %>',
        version: '<%= pkg.version %>',
        url: '<%= pkg.homepage %>',
        options: {
          paths: 'build',
          outdir: 'docs'
        }
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'build/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },

    watch: {
      files: ['src/**/*'],
      tasks: ['default']
    },

    karma: {
      build: {
        configFile: 'karma.conf.js'
      },
      release: {
        configFile: 'karma.conf.js',
        singleRun: true,
        browsers: ['PhantomJS']
      }
    }

  });

  // modules
  grunt.loadNpmTasks('grunt-contrib-yuidoc');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-karma');

  // tasks
  grunt.registerTask('build', ['jshint:build','concat:build','uglify:build','karma:build']);
  grunt.registerTask('release', ['build','yuidoc:release']);
};
