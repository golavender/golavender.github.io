module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-exec');
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

    watch: {
      scripts: {
        files: [
          'views/*.lavender',
          'views/layouts/*.lavender',
        ],
        tasks: ['exec:lavender'],
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

  grunt.registerTask('default', ['exec']);
  grunt.registerTask('serve', ['exec','connect:server','watch']);
};
