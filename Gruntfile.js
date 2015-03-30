module.exports = function(grunt) {
	grunt.initConfig({
		clean: [
			'tmp'
		],
		concat: {
			css: {
				dest: 'tmp/styles.css',
				src: [
					'css/normalize.css',
					'css/animate.css',
					'css/ionicons.css',
					'css/styles.css'
				]
			},
			js: {
				dest: 'tmp/scripts.js',
				src: [
					'js/vendor/jquery-2.1.3.js',
					'js/vendor/underscore.js',
					'js/vendor/backbone.js',
					'js/vendor/accounting.js',
					'js/vendor/backbone-sync.js',
					'js/vendor/backbone-validation.js',
					'js/vendor/handlebars-v3.0.0.js',
					'js/vendor/jquery.cookie.js',
					'js/vendor/jquery.mobile.events.js',
					'js/vendor/jquery.pep.js',
					'js/vendor/shake.js',
					'js/app.js',
					'js/db.js',
					'js/models/dao/*.js',
					'js/models/*.js',
					'js/collections/*.js',
					'js/views/*.js',
					'js/misc/*.js'
				]
			}
		},
		cssmin: {
			target: {
				files: [{
					'css/main.min.css': 'tmp/styles.css'
				}]
			}
		},
		less: {
			target: {
				files: {
					'css/styles.css': 'css/styles.less'
				}
			}
		},
		uglify: {
			target: {
				files: {
					'js/main.min.js': 'tmp/scripts.js'
				}
			}
		},
		watch: {
			scripts: {
				files: ['js/**/*.js', '!js/main.min.js'],
				tasks: ['js', 'clean']
			},
			styles: {
				files: ['css/*', '!css/styles.css', '!css/main.min.css'],
				tasks: ['css', 'clean']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('build', ['css', 'js', 'clean']);
	grunt.registerTask('css', ['less', 'concat:css', 'cssmin']);
	grunt.registerTask('js', ['concat:js', 'uglify']);
	grunt.registerTask('default', ['build']);
};
