module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },
    
    jasmine: {
      pivotal: {
        src: 'src/**/*.js',
        options: {
          specs: 'spec/*Spec.js',
          helpers: 'spec/*Helper.js'
        }
      }
    }
  });

  // uglify
  grunt.loadNpmTasks('grunt-contrib-uglify');
  // jasmine
  grunt.loadNpmTasks('grunt-contrib-jasmine');

  // Default task(s).
  grunt.registerTask('default', ['jasmine','uglify']);

};