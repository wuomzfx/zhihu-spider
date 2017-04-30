const gulp = require('gulp')
const lint = require('gulp-eslint')
const nodemon = require('gulp-nodemon')

function lintFiles (files) {
  return gulp.src(files)
    .pipe(lint())
    .pipe(lint.format())
    // .pipe(lint.failAfterError())
}

gulp.task('eslint', () => lintFiles(['**/*.js', '!node_modules/**']))

gulp.task('eslint_nodemon', ['eslint'], () => {
  return nodemon({
    script: './app/server.js',
    tasks (changedFiles) {
      lintFiles(changedFiles)
      return []
    },
    ignore: ['build/**', 'dist/**', '.git', 'node_modules/**']
  })
})

gulp.task('default', ['eslint_nodemon'])
