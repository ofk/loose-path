"use strict";
/* eslint-disable @typescript-eslint/no-non-null-assertion */
Object.defineProperty(exports, "__esModule", { value: true });
exports.relative = exports.resolve = exports.join = exports.normalize = exports.extname = exports.dirname = exports.basename = exports.isAbsolute = void 0;
function isAbsolute(path) {
    return /^(?:\/|\w+:)/.test(path);
}
exports.isAbsolute = isAbsolute;
function rootname(path) {
    var m = /^(\w+:)(\/\/[^/]+\/?|[\\/])/.exec(path);
    if (m) {
        return m[2] === '\\' ? m[1] + "/" : m[0];
    }
    return path.startsWith('/') ? '/' : '';
}
function basename(path, ext) {
    if (ext === void 0) { ext = ''; }
    var rootpath = rootname(path);
    var m = /([^/]*)\/*$/.exec(path.slice(rootpath.length));
    var name = m ? m[1] : '';
    return ext && name.endsWith(ext) ? name.slice(0, -ext.length) : name;
}
exports.basename = basename;
function dirname(path) {
    var rootpath = rootname(path);
    var dirpath = path.slice(rootpath.length).replace(/\/?([^/]+)\/*$/, '');
    return "" + rootpath + dirpath || '.';
}
exports.dirname = dirname;
function extname(path) {
    var rootpath = rootname(path);
    var m = /[^/.](\.\w*)$/.exec(path.slice(rootpath.length));
    return m ? m[1] : '';
}
exports.extname = extname;
function normalize(path) {
    var rootpath = rootname(path);
    var normpath = path.slice(rootpath.length).replace(/[\\/]+/g, '/');
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
function relative(from, to) {
    var fromRoot = rootname(from);
    var toRoot = rootname(to);
    if (fromRoot !== toRoot) {
        return to;
    }
    var fromResolvePath = resolve('/', from);
    var toResolvePath = resolve('/', to);
    if (fromResolvePath === toResolvePath) {
        return '';
    }
    var fromPath = fromResolvePath.slice(fromRoot.length);
    var toPath = toResolvePath.slice(toRoot.length);
    var fromParts = fromPath.split('/').filter(function (part) { return part; });
    var toParts = toPath.split('/').filter(function (part) { return part; });
    var commonSize = 0;
    for (var minSize = Math.min(fromParts.length, toParts.length); commonSize < minSize && fromParts[commonSize] === toParts[commonSize]; commonSize += 1)
        ;
    var restSize = fromParts.length - commonSize;
    var parentParts = [];
    for (var i = 0; i < restSize; i += 1) {
        parentParts.push('..');
    }
    var parts = parentParts.concat(toParts.slice(commonSize));
    return parts.join('/');
}
exports.relative = relative;
