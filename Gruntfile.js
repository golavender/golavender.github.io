module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.initConfig({
    exec: {
      lavender: {
        cmd: function(){

          var command     = "php vendor/lavender/src/Lavender/lavender-cli.php views $view $destination;"
            , view        = "view=$(echo $file | sed -e 's/\\.lavender$//' | sed -e 's/^views\\///');"
            , destination = "destination=$(echo $file | sed -e 's/lavender$/html/' | sed -e 's/^views\\///');"
            , loop = "for file in `ls views/*.lavender`; do " + view + destination + command + " done"

          return loop;
        }
      }
    },

    sass: {
      dist: {
        files: {
          'public/css/main.css': 'views/sass/main.scss'
        }
      }
    },

    watch: {
      scripts: {
        files: [
          'views/*.lavender',
          'views/layouts/*.lavender',
          'views/sass/*.scss',
          'views/sass/*/*.scss'
        ],
        tasks: ['exec:lavender', 'sass'],
        options: {
          spawn: false,
        }
      }
    },

    connect: {
      server: {
        options: {
          base: '../golavender.github.io',
          port: 9883
        }
      }
    }
  });

  grunt.registerTask('default', ['exec', 'sass']);
  grunt.registerTask('serve', ['exec','sass','connect:server','watch']);
};
