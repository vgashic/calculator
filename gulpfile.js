var gulp = require("gulp");

var sass = require("gulp-sass");
var useref = require("gulp-useref");
var uglify = require("gulp-uglify");
var gulpIf = require("gulp-if");
var gutil = require("gulp-util");
var imagemin = require("gulp-imagemin");
var cache = require("gulp-cache");
var del = require("del");
var runSeq = require("run-sequence");

gulp.task("sass", function () {
	return gulp.src("app/scss/**/*.scss")
		.pipe(sass()) // Using gulp-sass
		.pipe(gulp.dest("app/css"));
});

// gulp.watch("app/scss/**/*.scss", ["sass"]);

gulp.task("watch", function () {
	// sass watcher
	gulp.watch(["app/scss/**/*.scss", "app/index.html", "app/js/**/*-js"], ["sass"]);
});

gulp.task("useref", function () {
	return gulp.src("app/*.html")
		.pipe(useref())
		/*.pipe(uglify().on("error", gutil.log))
		.pipe(gulpIf("*.js", uglify()))*/
		.pipe(gulp.dest("dist"));
});

gulp.task("images", function () {
	return gulp.src("app/img/**/*.+(png|jpg|gif|svg)")
		.pipe(cache(imagemin()))
		.pipe(gulp.dest("dist/img"));
});

gulp.task("fonts", function () {
	return gulp.src("app/fonts/**/*")
		.pipe(gulp.dest("dist/fonts"));
});

gulp.task("js", function () {
	return gulp.src("app/js/**/*")
		.pipe(gulp.dest("dist/js"));
});

gulp.task("css", function () {
	return gulp.src("app/css/**/*")
		.pipe(gulp.dest("dist/css"));
});

gulp.task("html", function () {
	return gulp.src("app/*.html")
		.pipe(gulp.dest("dist"));
});


gulp.task("clean:dist", function () {
	return del.sync("dist");
});

gulp.task("build", function (callback) {
	runSeq("clean:dist", ["sass", "css", "js", "html", "images", "fonts"],
		callback)
});