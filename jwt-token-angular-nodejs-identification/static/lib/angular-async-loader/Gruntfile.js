/*global module:false */
module.exports = function( grunt ) {
  'use strict';
  var shell = require('shelljs');
  var semver = require('semver');

  var SOURCES = [ 'src/**/*.js' ];
  var DEMOSOURCES = [ 'demo/scripts/**/*.js' ];
  var DISTSOURCES = [
    'src/angular-async-loader.js'
  ];
  var DISTDIR = 'dist';
  var TASK_IMPORTS = [
    'grunt-contrib-concat',
    'grunt-contrib-uglify',
    'grunt-contrib-jshint',
    'grunt-contrib-clean',
    'grunt-remove-logging',
    'grunt-karma'
  ];

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    clean: {
      dist: [DISTDIR],
    },

    concat: {
      options: {
        stripBanners: {
          line: true
        },
        banner: '// <%= pkg.name %> - v<%= pkg.version %>\n\n',
        process: {
          version: true
        }
      },
      dist: {
        src: DISTSOURCES,
        dest: DISTDIR + '/<%= pkg.name %>.js'
      }
    },

    removelogging: {
      dist: {
        src: "<%= concat.dist.dest %>"
      }
    },

    uglify: {
      options: {
        banner: '/* <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */ ',
        mangle: {
          topleve: true,
          defines: {
            NDEBUG: true
          }
        },
        squeeze: {},
        codegen: {}
      },
      dist: {
        src: [ '<%= concat.dist.dest %>' ],
        dest: DISTDIR + '/<%= pkg.name %>.min.js'

      }
    },

    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        evil: true,
        devel: true
      },
      grunt: {
        src: [ 'Gruntfile.js' ],
        options: {node:true}
      },
      source: {
        src: SOURCES.concat(DEMOSOURCES),
        options: {
          globals: {
            angular: true
          }
        }
      }
    }
  });

  TASK_IMPORTS.forEach(grunt.loadNpmTasks);

  grunt.registerTask('default', ['jshint']);

  grunt.registerTask('dist', ['jshint', 'concat', 'removelogging', 'min']);

  grunt.registerTask('min', ['uglify']);

  function run(cmd, msg){
    shell.exec(cmd, {silent:true});
    if( msg ){
      grunt.log.ok(msg);
    }
  }

  grunt.registerTask('release-prepare', 'Set up submodule to receive a new release', function(){
    // Make sure we have the submodule in dist
    run("git submodule init");
    run("git submodule update");
    run("cd dist; git checkout master");
    // Bump version
    var newVer = grunt.config('pkg').version;
    var comp = grunt.file.readJSON(DISTDIR+"/bower.json");
    grunt.log.writeln("Package version: " + newVer);
    grunt.log.writeln("Component version: " + comp.version);
    if( !semver.gt( newVer, comp.version ) ){
      grunt.warn("Need to up-version package.json first!");
    }
  });


  grunt.registerTask('release-commit', 'push new build to bower component repo', function(){
    // Stamp version
    var newVer = grunt.config('pkg').version;
    var comp = grunt.file.readJSON(DISTDIR+"/bower.json");
    grunt.log.writeln("Package version: " + newVer);
    grunt.log.writeln("Component version: " + comp.version);
    if( !semver.gt( newVer, comp.version ) ){
      grunt.warn("Need to up-version package.json first!");
    }
    comp.version = newVer;
    grunt.file.write(DISTDIR+"/bower.json", JSON.stringify(comp, null, '  ')+'\n');
    // Commit submodule
    // Tag submodule
    run('cd dist; git commit -a -m"Build version '+ newVer +'"', "Commited to bower repo");
    run('cd dist; git tag ' + newVer + ' -m"Release version '+ newVer +'"', "Tagged bower repo");
    // Commit and tag this.
    run('git commit -a -m"Build version '+ newVer +'"', "Commited to source repo");
    run('git tag ' + newVer + ' -m"Release version '+ newVer +'"', "Tagged source repo");
    run("git submodule update");
    // push?
    grunt.log.ok("DON'T FORGET TO PUSH BOTH!");
  });

  grunt.registerTask('release', 'build and push to the bower component repo',
                     ['release-prepare', 'dist', 'release-commit']);
};
