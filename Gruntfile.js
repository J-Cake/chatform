module.exports = function (grunt) {
    grunt.file.setBase('./');

    grunt.initConfig({
        pgk: grunt.file.readJSON('package.json'),

        browserify: {
            default: {
                options: {
                    browserifyOptions: {
                        debug: true
                    }
                },
                files: {
                    "./dist/public/src.js": './dist/public/src/*.js'
                }
            }
        },
        uglify: {
            default: {
                files: {
                    './dist/public/src.min.js': ['./dist/public/src.js']
                }
            }
        },
        watch: {
            default: {
                files: ["./public/src/*.ts"],
                tasks: ["browserify"],
                options: {
                    ecma: 8,
                    interrupt: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask("production", ['browserify', 'uglify']);
    grunt.registerTask('development', ['browserify', 'watch']);

    grunt.registerTask('default', 'development');
};
