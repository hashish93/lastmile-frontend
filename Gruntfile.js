/**
 * Created by hashish on 10/17/2016.
 */
module.exports = function (grunt) {
    //configure main project setting
    grunt.initConfig({
        // basic setting and info about plugins
        pkg: grunt.file.readJSON('package.json'),

        // name of the plugin (without the grunt-contrib-")

        cssmin: {
            combine: {
                files: {
                    'commons/css/main.css': [
                        'vendors/bootstrap/css/bootstrap.min.css',
                        'vendors/ui-grid/css/ui-grid.min.css',
                        'bower_components/angular-spinkit/build/angular-spinkit.min.css',
                        'commons/css/style.css',
                        'vendors/growl/css/growl.css',
                        'bower_components/angular-ui-select/dist/select.min.css',
                        'bower_components/select2/select2.css'
                    ]
                }
            }
        }
    })

    // load the plugin
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    // do the task
    grunt.registerTask('default',['cssmin']);


}