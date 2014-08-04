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

  var audioSrcFiles = [
    'src/utils/polyfill.js',
    'src/herman.js',
    'src/audio/*.js'
  ];

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      all: ['src/**/*.js']
    },

    concat: {
      all: {
        src: srcFiles,
        dest: 'build/<%= pkg.name %>.js'
      },
      audio: {
        src: audioSrcFiles,
        dest: 'build/<%= pkg.name %>.audio.js'
      },
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
          specs: [
            'spec/hermanSpec.js',
            'spec/matrixSpec.js',
            'spec/nodeSpec.js',
            'spec/vectorSpec.js',
            'spec/SoundSpec.js',
            'spec/AudioPlayerSpec.js'
          ],
          host : 'http://localhost:8000'
        }
      }
    },

    watch: {
      files: ['src/**/*'],
      tasks: ['default'],
    },

    karma: {
      default: {
        configFile: 'karma.conf.js'
      },
      build: {
        configFile: 'karma.conf.js',
        singleRun: true,
        browsers: ['PhantomJS']
      },
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
  grunt.registerTask('default', ['concat:all','karma:default']);
  grunt.registerTask('audio', ['concat:audio']);
  grunt.registerTask('build', ['jshint','concat:all','uglify','karma:build','yuidoc']);
  grunt.registerTask('serve', ['watch']);
};
