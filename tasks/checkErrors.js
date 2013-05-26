var checkErrors;

checkErrors = function(task) {
  this.origTask = task;
  this.options = task.options(checkErrors.Defaults);
};

checkErrors.prototype = {
  run: function() {
    var checkFile, checker, checks, counter, defaultChecks, done, files, total;

    checkFile = function(file) {
      var check, stats;

      stats = fs.statSync(file);
      if (stats.isFile()) {
        fs.readFile(file, "utf8", function(error, data) {});
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
          return done(true);
        } else {
          counter++;
          return checkFile(files[counter]);
        }
      } else {
        if (counter >= total) {
          return done(true);
        } else {
          counter++;
          return checkFile(files[counter]);
        }
      }
    };
    done = this.async();
    files = grunt.file.expand(this.data[0].src[0]);
    counter = 0;
    total = files.length - 1;
    defaultChecks = this.options.checks;
    checks = (typeof this.data.check !== "undefined" ? this.data.check : defaultChecks);
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

checkErrors.taskName = "checkErrors";

checkErrors.taskDescription = "checkErrors";

checkErrors.registerWithGrunt = function(grunt) {
  grunt.registerMultiTask(checkErrors.taskName, checkErrors.taskDescription, function() {
    var task;

    task = new checkErrors(this);
    return task.run();
  });
};

module.exports = checkErrors;
