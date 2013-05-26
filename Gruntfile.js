/*!
* File name:   Gruntfile.js
* Description: Build file for the plugin
* Version:     1.0
*/

module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		files: {
			coffee: './coffee',
			test: [
				'<%= files.source %>/test/**/*.js',
				'./karma.conf.js'
			]
		},

		coffeelint: {
			app: ['<%= files.coffee %>/*.coffee'],
			options: {
				"no_backticks": {
	                "level": "ignore"
	            },
	            "no_trailing_whitespace": {
	                "level": "ignore"
	            },
	            "no_tabs" : {
	                "level": "ignore"
	            },
	            "indentation": {
	                "level": "ignore"
	            },
	            "max_line_length": {
					"level": "ignore"
	            }
			}
		},

		coffee: {
			plugin: {
				options: {
					bare: true
				},
				expand: true,
			    flatten: true,
			    cwd: '<%= files.coffee %>',
			    src: ['*.coffee'],
			    dest: 'lib',
			    ext: '.js'
			}
		},

		jshint: {
			options: {
				"curly": true,
				"eqnull": true,
				"eqeqeq": true,
				"undef": false,
				"globals": {
					"jQuery": true
				}
			},
			files: {
				src: [
					'<%= files.js %>'
				]
			}
		},

		watch: {
			js: {
				files: [
					'<%= files.coffee %>/**/*.coffee'
				],
				tasks: 'coffee'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-coffee');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');


	// Tasks
	grunt.registerTask(		// Dev task
		'compile',
		[
			'coffee'
		]
	);

	grunt.registerTask('default', ['compile', 'watch']);
	
};