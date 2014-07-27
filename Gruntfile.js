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
      all: ['src/**/*.js']
    },

    concat: {
       dist: {
        src: srcFiles,
        dest: 'build/<%= pkg.name %>.js'
      }
    },    

    yuidoc: {
      compile: {
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
    
    jasmine: {
      pivotal: {
        src: 'build/<%= pkg.name %>.js',
        options: {
          display: 'full',
          specs: 'spec/*Spec.js',
          helpers: 'spec/*Helper.js'
        }
      }
    },

    watch: {
      files: ['src/**/*'],
      tasks: ['default'],
    },

    connect: {
        server: {
            options: {
                port: 8000,
                base: '.'
            }
        }
    }

  });

  // modules
  grunt.loadNpmTasks('grunt-contrib-yuidoc');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // tasks
  grunt.registerTask('default', ['concat','jasmine']);
  grunt.registerTask('build', ['jshint','concat','jasmine','uglify','yuidoc']);
  grunt.registerTask('serve', ['connect','watch']);

};