/* eslint-disable @typescript-eslint/no-non-null-assertion */

export function isAbsolute(path: string): boolean {
  return /^(?:\/|\w+:)/.test(path);
}

function rootname(path: string): string {
  const m = /^\w+:(?:\/\/[^/]+)?\/?/.exec(path);
  return m ? m[0]! : '/';
}

export function basename(path: string, ext = ''): string {
  const m = /([^/]*)\/*$/.exec(path);
  const name = m ? m[1]! : '';
  return ext && name.endsWith(ext) ? name.slice(0, -ext.length) : name;
}

export function dirname(path: string): string {
  const dirpath = path.replace(/\/?([^/]+)\/*$/, '');
  return dirpath || (isAbsolute(path) ? rootname(path) : '.');
}

export function extname(path: string): string {
  const m = /[^/.](\.\w*)$/.exec(path);
  return m ? m[1]! : '';
}

export function normalize(path: string): string {
  const rootpath = isAbsolute(path) ? rootname(path) : '';
  let normpath = path;
  if (rootpath) {
    normpath = normpath.slice(rootpath.length);
  }
  normpath = normpath.replace(/[\\/]+/g, '/');
  if (rootpath) {
    normpath = normpath.replace(/^(?:\/\.{0,2})+/, '');
  }
  const dirs = [] as string[];
  normpath.split('/').forEach((dir) => {
    if (dir === '.') {
      if (!dirs.length) {
        dirs.push(dir);
      }
    } else if (dir === '..') {
      if (dirs.length && dirs[dirs.length - 1] !== '..') {
        dirs.pop();
      } else if (!rootpath) {
        dirs.push(dir);
      }
    } else {
      if (dir !== '' && dirs[dirs.length - 1] === '.') {
        dirs.pop();
      }
      dirs.push(dir);
    }
  });
  return rootpath + dirs.join('/') || '.';
}

export function join(...paths: string[]): string {
  return normalize(paths.join('/'));
}

export function resolve(...paths: string[]): string {
  let index = paths.length - 1;
  for (; !isAbsolute(paths[index]!) && index > 0; index -= 1);
  return join(...paths.slice(index));
}
