var checkErrors, fs, _;

_ = require('lodash');

fs = require('fs');

checkErrors = function(task) {
  this.origTask = task;
  this.options = checkErrors.Defaults;
};

checkErrors.prototype = {
  run: function(grunt) {
    var checkFile, checker, checks, counter, done, files, total;

    checkFile = function(file) {
      var stats;

      stats = fs.statSync(file);
      if (stats.isFile()) {
        return fs.readFile(file, "utf8", function(error, data) {
          var check;

          if (error) {
            grunt.fail.fatal("Can't read file: " + file);
            if (error) {
              throw error;
            }
          }
          check = data.match(checker);
          if (check) {
            grunt.log.error(check);
            grunt.fail.fatal("Error found on file: " + file);
            if (error) {
              throw error;
            }
          }
          if (counter >= total) {
            done(true);
          } else {
            counter++;
            checkFile(files[counter]);
          }
        });
      } else {
        if (counter >= total) {
          return done(true);
        } else {
          counter++;
          return checkFile(files[counter]);
        }
      }
    };
    done = this.origTask.async();
    files = grunt.file.expand(this.origTask.data[0].src[0]);
    counter = 0;
    total = files.length - 1;
    checks = this.options.checks;
    checker = "";
    _.each(checks, function(check) {
      return checker += "(" + check + ")|";
    });
    checker = checker.substr(0, checker.length - 1);
    checkFile(files[counter]);
  }
};

checkErrors.Defaults = {
  checks: ['<<<<<<< HEAD']
};

checkErrors.taskName = "checkerrors";

checkErrors.taskDescription = "A simple grunt plugin to check files for common compilation errors that may be missed when running automated builds";

checkErrors.registerWithGrunt = function(grunt) {
  grunt.registerMultiTask(checkErrors.taskName, checkErrors.taskDescription, function() {
    var task;

    task = new checkErrors(this);
    return task.run(grunt);
  });
};

module.exports = checkErrors;
