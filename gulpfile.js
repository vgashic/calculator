var gulp = require("gulp");

var sass = require("gulp-sass");

gulp.task("sass", function () {
	return gulp.src("app/scss/**/*.scss")
		.pipe(sass()) // Using gulp-sass
		.pipe(gulp.dest("app/css"))
});

// gulp.watch("app/scss/**/*.scss", ["sass"]);

gulp.task("watch", function () {
	// sass watcher
	gulp.watch("app/scss/**/*.scss", ["sass"]);
});