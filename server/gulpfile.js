const gulp = require('gulp')
const lint = require('gulp-eslint')
const nodemon = require('gulp-nodemon')

function lintChanges (files) {
  return gulp.src(files)
    .pipe(lint())
    .pipe(lint.format())
}

gulp.task('eslint', () => gulp.src(['**/*.js', '!node_modules/**'])
    .pipe(lint())
    .pipe(lint.format()))
    // .pipe(eslint.failAfterError())

gulp.task('eslint_nodemon', ['eslint'], () => {
  const stream = nodemon({
    script: './index.js',
    tasks (changedFiles) {
      lintChanges(changedFiles)
      return []
    },
    ignore: ['build/*.js', 'dist/*.js', 'nodemon.json', '.git', 'node_modules/**/node_modules', 'gulpfile.js']
  })

  return stream
    .on('restart', () => {
      // console.log('Application has restarted!');
    })
    .on('crash', () => {
      stream.emit('restart', 20)  // restart the server in 20 seconds
    })
})

gulp.task('default', ['eslint_nodemon'], () => {
  // console.log('ESlin检查完成')
})
