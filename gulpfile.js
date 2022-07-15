const gulp = require('gulp');
const ts = require('gulp-typescript');
const typescript = require('typescript');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const nls = require('vscode-nls-dev');
const webpackStream=require('webpack-stream');
const webpack=require('webpack');
const webConfig=require('./webpack.config');
const tsProject = ts.createProject('./tsconfig.json', { typescript });

const languages = [{ folderName: 'zh-cn', id: 'zh-cn' }];

const inlineMap = true;
const inlineSource = false;
const outDest = 'out';

const cleanTask = function() {
  return del(['out/**', 'package.nls.*.json', 'i18n-sample*.vsix']);
};

const cleanI18n=function(){
  return del(['out/template/','out/*.nls.metadata.json']);
};

const internalBundleCompileTask=function(){
  return doBundle();
};
const doCompile = function () {
  var r = tsProject.src()
    .pipe(sourcemaps.init())
    .pipe(tsProject()).js
    // .pipe(nls.createMetaDataFiles())
    .pipe( nls.rewriteLocalizeCalls())
    .pipe(nls.createAdditionalLanguageFiles(languages, 'i18n', 'out'));
    // .pipe(nls.bundleMetaDataFiles('sinh','out'))
    // .pipe(nls.bundleLanguageFiles());
    
  if (inlineMap && inlineSource) {
    r = r.pipe(sourcemaps.write());
  } else {
    r = r.pipe(sourcemaps.write("../out", {
      // no inlined source
      includeContent: inlineSource,
      // Return relative source map root directories per file.
      sourceRoot: "../src"
    }));
  }

  return r.pipe(gulp.dest(outDest));
};

const addI18nTask = function() {
  return gulp.src(['package.nls.json'])
    .pipe(nls.createAdditionalLanguageFiles(languages, 'i18n'))
    .pipe(gulp.dest('.'));
};

const doBundle=function(){
  var r = tsProject.src()
    .pipe(webpackStream(webConfig,webpack));
  return r.pipe(gulp.dest(outDest));
};

const sourcesI18nNsl = function () {
  return gulp.src(['**/*.nls.metadata.json'], { base: "./out" })
    .pipe(nls.createAdditionalLanguageFiles(languages, 'i18n', 'out'))
    .pipe(nls.bundleMetaDataFiles('webpackNls', ''))
    .pipe(nls.bundleLanguageFiles())
    // .pipe(filter(['**/nls.bundle.*.json', '**/nls.metadata.header.json', '**/nls.metadata.json']))
    .pipe(gulp.dest(`./out`));
};

const nlsTask = gulp.series(sourcesI18nNsl, addI18nTask,cleanI18n);
const buildTask = gulp.series(cleanTask, doCompile, addI18nTask);
const bundleTask= gulp.series(cleanTask,internalBundleCompileTask,nlsTask);


gulp.task('nls',nlsTask);

gulp.task('clean', cleanTask);

gulp.task('build', buildTask);

gulp.task('bundle',bundleTask);