import {join} from 'node:path/posix';
import {existsSync, readFileSync} from 'node:fs';

import {deleteSync} from 'del';
import {globbySync, isDynamicPattern} from 'globby';
import gulp from 'gulp';
import rename from 'gulp-rename';
import rev from 'gulp-rev';
import revRewrite from 'gulp-rev-rewrite';

import config from '../config/index.js';

import {getDirectory, getRelativePath} from './utilities.js';



const {src, dest} = gulp;



async function build(done) {
	const {default: libs} = await import(`${join('..', config.libs)}?t=${Date.now()}`);

	const normalizedLibs = {};

	for (let [destPath, srcPaths] of Object.entries(libs)) {
		if (typeof srcPaths === 'string') {
			srcPaths = [srcPaths];
		}

		for (const srcPath of srcPaths) {
			// Match one of the following:
			// - module/**
			// - @scope/module/**
			// - node_modules/module/**
			// - node_modules/@scope/module/**
			// - /node_modules/module/**
			// - /node_modules/@scope/module/**
			// - ./node_modules/module/**
			// - ./node_modules/@scope/module/**
			const packageRegex = /^(?:(?!\.{0,2}\/)(?:node_modules\/)?|\.{0,2}\/node_modules\/)(?<package>(?!@|node_modules).+?(?=\/)|@(?:.+?(?=\/)){2})\/(?<file>.+)/;
			const packageMatch = srcPath.match(packageRegex);

			if (packageMatch) {
				const cwd = join('node_modules', packageMatch.groups.package);
				const files = globbySync(packageMatch.groups.file, {
					cwd,
				});

				for (const file of files) {
					normalizedLibs[isDynamicPattern(srcPath) ? join(destPath, file) : destPath] = join(cwd, file);
				}
			} else if (isDynamicPattern(srcPath)) {
				const cwd = getDirectory(srcPath);
				const glob = srcPath.slice(cwd.length);
				const files = globbySync(glob.startsWith('/') ? glob.slice(1) : glob, {
					cwd,
				});

				for (const file of files) {
					normalizedLibs[join(destPath, file)] = join(cwd, file);
				}
			} else {
				normalizedLibs[destPath] = srcPath;
			}
		}
	}

	deleteSync(config.build.libs);

	for (const [destPath, srcPath] of Object.entries(normalizedLibs)) {
		src(srcPath)
			.pipe(rename(destPath))
			.pipe(dest(getDirectory(config.build.libs)));
	}

	done();
}



function dist() {
	const manifest = existsSync(config.revManifest)
		? readFileSync(config.revManifest)
		: undefined;

	return src(config.build.libs, {
		base: config.build.assets,
	})
		.pipe(rev())
		.pipe(revRewrite({
			manifest,
			modifyUnreved: (path, {relative}) => getRelativePath(path, relative),
			modifyReved: (path, {relative}) => getRelativePath(path, relative),
		}))
		.pipe(dest(config.dist.assets))
		.pipe(rev.manifest({
			merge: true,
		}))
		.pipe(dest(getDirectory(config.revManifest)));
}



function backend() {
	return src(config.dist.libs)
		.pipe(dest(getDirectory(config.backend.libs)));
}



build.displayName = 'build:libs';
dist.displayName = 'dist:libs';
backend.displayName = 'backend:libs';

export {
	build,
	dist,
	backend,
};
