module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      myFiles: ['app.js', 'controllers/**/*.js', 
          'directives/**/*.js', 'services/**/*.js']
    }


  });

  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['jshint:myFiles']);
};
