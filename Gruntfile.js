module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    concat: {
       dist: {
        // the files to concatenate
        src: ['src/herman.js','src/math/*.js','src/scene/*.js','src/dom/*.js','src/canvas/*.js'],
        // the location of the resulting JS file
        dest: 'build/<%= pkg.name %>.js'
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
        src: 'build/<%= pkg.name %>.min.js',
        options: {
          specs: 'spec/*Spec.js',
          helpers: 'spec/*Helper.js'
        }
      }
    }

  });

  // tasks
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jasmine');

  // Default task(s).
  grunt.registerTask('default', ['concat','uglify','jasmine']);

};