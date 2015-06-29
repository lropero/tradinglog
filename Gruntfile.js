module.exports = function(grunt) {
	grunt.initConfig({
		clean: [
			'tmp'
		],
		concat: {
			options: {
				process: function(src, filepath) {
					if(filepath.indexOf('.tpl') > -1) {
						src = '<script type="text/x-handlebars-template" id="' + getFilename(filepath) + '-template">' + src + '</script>';
					}
					return src;
				},
				separator: grunt.util.linefeed
			},
			css: {
				dest: 'tmp/styles.css',
				src: [
					'css/normalize.css',
					'css/animate.css',
					'css/guiders.css',
					'css/ionicons.css',
					'css/slick.css',
					'css/styles.css'
				]
			},
			html: {
				dest: 'dist/templates.tpl',
				src: [
					'js/templates/*.tpl'
				]
			},
			js: {
				dest: 'tmp/scripts.js',
				src: [
					'js/vendor/jquery-2.1.4.js',
					'js/vendor/underscore.js',
					'js/vendor/backbone.js',
					'js/vendor/accounting.js',
					'js/vendor/alertify.js',
					'js/vendor/backbone-sync.js',
					'js/vendor/backbone-validation.js',
					'js/vendor/big.js',
					'js/vendor/Chart.js',
					'js/vendor/guiders.js',
					'js/vendor/handlebars-v3.0.3.js',
					'js/vendor/jquery.cookie.js',
					'js/vendor/jquery.mobile.events.js',
					'js/vendor/jquery.pep.js',
					'js/vendor/lz-string.js',
					'js/vendor/shake.js',
					'js/vendor/slick.js',
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
					'dist/styles.css': 'tmp/styles.css'
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
					'dist/scripts.js': 'tmp/scripts.js'
				}
			}
		},
		watch: {
			html: {
				files: ['js/templates/*.tpl'],
				task: ['concat:html']
			},
			scripts: {
				files: ['js/**/*.js'],
				tasks: ['js', 'clean']
			},
			styles: {
				files: ['css/*', '!css/styles.css'],
				tasks: ['css', 'clean']
			}
		}
	});

	function getFilename(filepath) {
		var split = filepath.split('/');
		return split[split.length - 1].replace('.tpl', '');
	}

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('build', ['concat:html', 'css', 'js', 'clean']);
	grunt.registerTask('css', ['less', 'concat:css', 'cssmin']);
	grunt.registerTask('js', ['concat:js', 'uglify']);
	grunt.registerTask('default', ['build']);
};
