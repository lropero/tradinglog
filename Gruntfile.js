module.exports = function(grunt) {
	grunt.initConfig({
		clean: [
			'tmp'
		],
		concat: {
			options: {
				separator: grunt.util.linefeed,
				process: function(src, filepath) {
					var filename;

					if (filepath.indexOf(".tpl") > -1) {
						filename = parseTemplate(filepath);
						var newSrc = '<script type="text/x-handlebars-template" id="' + filename + '-template">' + src + '</script>';
						src = newSrc;
					}

					return src;
				}
			},
			css: {
				dest: 'tmp/styles.css',
				src: [
					'css/normalize.css',
					'css/animate.css',
					'css/ionicons.css',
					'css/slick.css',
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
					'js/vendor/alertify.js',
					'js/vendor/backbone-sync.js',
					'js/vendor/backbone-validation.js',
					'js/vendor/Chart.js',
					'js/vendor/handlebars-v3.0.1.js',
					'js/vendor/jquery.cookie.js',
					'js/vendor/jquery.mobile.events.js',
					'js/vendor/jquery.pep.js',
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
			},
			html:{
		        dest: 'tmp/output.min.html',
		        src: [
		          'js/templates/*.tpl'
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
			},
			html: {
				files: ['js/templates/*.tpl'],
				tasks: ['concat:html']
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

	function parseTemplate(filepath) {
		var filename, helper;
		helper = filepath.split("/");
		filename = helper[helper.length - 1];
		filename = filename.replace(".tpl", "");
		return filename;
	}
};
