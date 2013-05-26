checkErrors = (task) ->
    @origTask = task

    @options = task.options checkErrors.Defaults
    return

checkErrors.prototype =
    run: () ->
        checkFile = (file) ->
            stats = fs.statSync(file)
            if stats.isFile()
                fs.readFile file, "utf8", (error, data) ->
                if error
                    grunt.fail.fatal "Can't read file: " + file
                    throw error  if error
                check = data.match(checker)
                if check
                    grunt.log.error check
                    grunt.fail.fatal "Error found on file: " + file
                    throw error  if error
                if counter >= total
                    done true
                else
                    counter++
                    checkFile files[counter]

            else
                if counter >= total
                    done true
                else
                    counter++
                    checkFile files[counter]
        done = @async()
        files = grunt.file.expand(@data[0].src[0])
        counter = 0
        total = files.length - 1
        checks = @options.checks
        checker = ""
        _.each checks, (check) ->
            checker += "(" + check + ")|"

        checker = checker.substr(0, (checker.length - 1))
        checkFile files[counter]
        return

# A static attribute holding our defaults so we can test against them.
checkErrors.Defaults =
    checks: ['<<<<<<< HEAD']

# Some static task information
checkErrors.taskName = "checkerrors"
checkErrors.taskDescription = "A simple grunt plugin to check files for common compilation errors that may be missed when running automated builds"

# A static helper method for registering with Grunt
checkErrors.registerWithGrunt = (grunt) ->

    grunt.registerMultiTask checkErrors.taskName, checkErrors.taskDescription, () ->
        task = new checkErrors @

        task.run()

    return

module.exports = checkErrors