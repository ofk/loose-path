"use strict";
/* eslint-disable @typescript-eslint/no-non-null-assertion */
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolve = exports.join = exports.normalize = exports.extname = exports.dirname = exports.basename = exports.isAbsolute = void 0;
function isAbsolute(path) {
    return /^(?:\/|\w+:)/.test(path);
}
exports.isAbsolute = isAbsolute;
function rootname(path) {
    var m = /^\w+:(?:\/\/[^/]+)?\/?/.exec(path);
    return m ? m[0] : '/';
}
function basename(path, ext) {
    if (ext === void 0) { ext = ''; }
    var m = /([^/]*)\/*$/.exec(path);
    var name = m ? m[1] : '';
    return ext && name.endsWith(ext) ? name.slice(0, -ext.length) : name;
}
exports.basename = basename;
function dirname(path) {
    var dirpath = path.replace(/\/?([^/]+)\/*$/, '');
    return dirpath || (isAbsolute(path) ? rootname(path) : '.');
}
exports.dirname = dirname;
function extname(path) {
    var m = /[^/.](\.\w*)$/.exec(path);
    return m ? m[1] : '';
}
exports.extname = extname;
function normalize(path) {
    var rootpath = isAbsolute(path) ? rootname(path) : '';
    var normpath = path;
    if (rootpath) {
        normpath = normpath.slice(rootpath.length);
    }
    normpath = normpath.replace(/[\\/]+/g, '/');
    if (rootpath) {
        normpath = normpath.replace(/^(?:\/\.{0,2})+/, '');
    }
    var dirs = [];
    normpath.split('/').forEach(function (dir) {
        if (dir === '.') {
            if (!dirs.length) {
                dirs.push(dir);
            }
        }
        else if (dir === '..') {
            if (dirs.length && dirs[dirs.length - 1] !== '..') {
                dirs.pop();
            }
            else if (!rootpath) {
                dirs.push(dir);
            }
        }
        else {
            if (dir !== '' && dirs[dirs.length - 1] === '.') {
                dirs.pop();
            }
            dirs.push(dir);
        }
    });
    return rootpath + dirs.join('/') || '.';
}
exports.normalize = normalize;
function join() {
    var paths = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        paths[_i] = arguments[_i];
    }
    return normalize(paths.join('/'));
}
exports.join = join;
function resolve() {
    var paths = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        paths[_i] = arguments[_i];
    }
    var index = paths.length - 1;
    for (; !isAbsolute(paths[index]) && index > 0; index -= 1)
        ;
    return join.apply(void 0, paths.slice(index));
}
exports.resolve = resolve;
