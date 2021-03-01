/* eslint-disable @typescript-eslint/no-non-null-assertion */

export function isAbsolute(path: string): boolean {
  return /^(?:\/|\w+:)/.test(path);
}

function rootname(path: string): string {
  const m = /^\w+:(?:\/\/[^/]+)?\/?/.exec(path);
  if (m) {
    return m[0]!;
  }
  return path.startsWith('/') ? '/' : '';
}

export function basename(path: string, ext = ''): string {
  const rootpath = rootname(path);
  const m = /([^/]*)\/*$/.exec(path.slice(rootpath.length));
  const name = m ? m[1]! : '';
  return ext && name.endsWith(ext) ? name.slice(0, -ext.length) : name;
}

export function dirname(path: string): string {
  const rootpath = rootname(path);
  const dirpath = path.slice(rootpath.length).replace(/\/?([^/]+)\/*$/, '');
  return `${rootpath}${dirpath}` || '.';
}

export function extname(path: string): string {
  const rootpath = rootname(path);
  const m = /[^/.](\.\w*)$/.exec(path.slice(rootpath.length));
  return m ? m[1]! : '';
}

export function normalize(path: string): string {
  const rootpath = rootname(path);
  let normpath = path.slice(rootpath.length).replace(/[\\/]+/g, '/');
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

export function relative(from: string, to: string): string {
  const fromRoot = rootname(from);
  const toRoot = rootname(to);
  if (fromRoot !== toRoot) {
    return to;
  }

  const fromResolvePath = resolve('/', from);
  const toResolvePath = resolve('/', to);
  if (fromResolvePath === toResolvePath) {
    return '';
  }

  const fromPath = fromResolvePath.slice(fromRoot.length);
  const toPath = toResolvePath.slice(toRoot.length);
  const fromParts = fromPath.split('/').filter((part) => part);
  const toParts = toPath.split('/').filter((part) => part);
  let commonSize = 0;
  for (
    const minSize = Math.min(fromParts.length, toParts.length);
    commonSize < minSize && fromParts[commonSize] === toParts[commonSize];
    commonSize += 1
  );
  const restSize = fromParts.length - commonSize;
  const parentParts = [];
  for (let i = 0; i < restSize; i += 1) {
    parentParts.push('..');
  }
  const parts = parentParts.concat(toParts.slice(commonSize));
  return parts.join('/');
}
