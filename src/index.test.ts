import path from 'path';
import * as fuzzyPath from '.';

const FILE_TESTCASE = [
  '',
  '.',
  'file.ext',
  'file.EXT',
  'file.foo',
  'file.foo.ext',
  'file.',
  'file',
  '.file',
  '.ext',
  '.file.ext',
];

const FILEPATH_TESTCASE = [
  'foo/bar/baz/file.ext',
  '/foo/bar/baz/file.ext',
  'C:/foo/bar/baz/file.ext',
];

const DIRPATH_TESTCASE = [
  '/',
  './',
  '../',
  'baz/',
  '/baz',
  'foo/bar/baz/',
  '/foo/bar/baz/',
  '/foo/bar/baz/qux/..',
  'C:/foo/bar/baz/',
];

describe('basename', () => {
  [...FILE_TESTCASE, ...FILEPATH_TESTCASE, ...DIRPATH_TESTCASE].forEach((arg) => {
    it(`behaves the same as a native method if given "${arg}"`, () => {
      expect(fuzzyPath.basename(arg)).toEqual(path.basename(arg));
    });
  });

  FILE_TESTCASE.forEach((arg) => {
    it(`behaves the same as a native method if given "${arg}" and ".ext"`, () => {
      expect(fuzzyPath.basename(arg, '.ext')).toEqual(path.basename(arg, '.ext'));
    });
  });
});

describe('dirname', () => {
  [...FILE_TESTCASE, ...FILEPATH_TESTCASE, ...DIRPATH_TESTCASE].forEach((arg) => {
    it(`behaves the same as a native method if given "${arg}"`, () => {
      expect(fuzzyPath.dirname(arg)).toEqual(path.dirname(arg));
    });
  });
});

describe('extname', () => {
  [...FILE_TESTCASE, ...FILEPATH_TESTCASE, ...DIRPATH_TESTCASE].forEach((arg) => {
    it(`behaves the same as a native method if given "${arg}"`, () => {
      expect(fuzzyPath.extname(arg)).toEqual(path.extname(arg));
    });
  });
});

describe('isAbsolute', () => {
  ['/foo/bar', '/baz/..', 'qux/', '.'].forEach((arg) => {
    it(`behaves the same as a native method if given "${arg}"`, () => {
      expect(fuzzyPath.isAbsolute(arg)).toEqual(path.isAbsolute(arg));
    });
  });

  ['C:/foo', 'z:/'].forEach((arg) => {
    it(`expect an absolute path if it has a drive letter "${arg}"`, () => {
      expect(fuzzyPath.isAbsolute(arg)).toEqual(true);
    });
  });

  ['http://example.com'].forEach((arg) => {
    it(`expect an absolute path if it has a protocol schema "${arg}"`, () => {
      expect(fuzzyPath.isAbsolute(arg)).toEqual(true);
    });
  });
});

describe('join', () => {
  [
    [''],
    ['.'],
    ['.', '.', '.'],
    ['..', '..', '..'],
    ['foo', 'bar/baz', 'qux'],
    ['//foo//', '//bar//baz//', '//qux//'],
    ['foo', '..'],
    ['foo', '..', '..'],
    ['foo', '..', 'bar'],
    ['foo', '..', 'bar', 'baz'],
    ['foo', '..', 'bar', 'baz', '..', 'qux'],
  ].forEach((args) => {
    it(`behaves the same as a native method if given "${args}"`, () => {
      expect(fuzzyPath.join(...args)).toEqual(path.join(...args));
    });
  });

  ([
    [['c:/foo', 'bar'], 'c:/foo/bar'],
    [['c:/foo/', 'bar'], 'c:/foo/bar'],
    [['c:/foo', '/bar'], 'c:/foo/bar'],
    [['c:/foo/', '/bar'], 'c:/foo/bar'],
    [['d:/foo', '../bar'], 'd:/bar'],
    [['d:/foo', '../../bar'], 'd:/bar'],
    [['d:/foo/', '../bar'], 'd:/bar'],
    [['d:/foo/', '../../bar'], 'd:/bar'],
  ] as [string[], string][]).forEach(([args, result]) => {
    it(`joins "${args}" that has a drive letter`, () => {
      expect(fuzzyPath.join(...args)).toEqual(result);
    });
  });

  ([
    [['http://example.com', 'file'], 'http://example.com/file'],
    [['http://example.com/', 'file'], 'http://example.com/file'],
    [['http://example.com', '/file'], 'http://example.com/file'],
    [['http://example.com/', '/file'], 'http://example.com/file'],
    [['http://example.com/dir', 'file'], 'http://example.com/dir/file'],
    [['http://example.com/dir/', 'file'], 'http://example.com/dir/file'],
    [['http://example.com/dir', '/file'], 'http://example.com/dir/file'],
    [['http://example.com/dir/', '/file'], 'http://example.com/dir/file'],
    [['http://example.com/dir', '../file'], 'http://example.com/file'],
    [['http://example.com/dir', '../../file'], 'http://example.com/file'],
    [['http://example.com/dir/', '../file'], 'http://example.com/file'],
    [['http://example.com/dir/', '../../file'], 'http://example.com/file'],
  ] as [string[], string][]).forEach(([args, result]) => {
    it(`joins "${args}" that has a protocol schema`, () => {
      expect(fuzzyPath.join(...args)).toEqual(result);
    });
  });
});

describe('normalize', () => {
  [
    ...FILE_TESTCASE,
    ...FILEPATH_TESTCASE,
    ...DIRPATH_TESTCASE,
    'foo/../../bar',
    '/foo/../../bar',
    'foo/./bar//baz///qux/..',
    '/foo/./bar/././baz',
    '/foo/../bar/baz/qux/../../quux/.',
    './foo',
    '.././foo/',
  ].forEach((arg) => {
    it(`behaves the same as a native method if given "${arg}"`, () => {
      expect(fuzzyPath.normalize(arg)).toEqual(path.normalize(arg));
    });
  });

  ([
    ['c:/dir//file', 'c:/dir/file'],
    ['c:/../dir/../file', 'c:/file'],
    ['http://example.com//dir//file', 'http://example.com/dir/file'],
    ['http://example.com/../dir/../file', 'http://example.com/file'],
  ] as [string, string][]).forEach(([arg, result]) => {
    it(`returns normalized "${arg}"`, () => {
      expect(fuzzyPath.normalize(arg)).toEqual(result);
    });
  });
});

describe('resolve', () => {
  [
    ['/foo/bar', 'baz', 'qux'],
    ['/foo/bar', './baz', '../qux'],
    ['/foo/bar', '/baz', 'qux'],
    ['/foo/bar', '/baz', '../qux'],
  ].forEach((args) => {
    it(`behaves the same as a native method if given "${args}"`, () => {
      expect(fuzzyPath.resolve(...args)).toEqual(path.resolve(...args));
    });
  });

  ([
    [['c:/foo/bar', 'baz', 'qux'], 'c:/foo/bar/baz/qux'],
    [['c:/foo/bar', '/baz', 'qux'], '/baz/qux'],
    [['c:/foo/bar', 'd:/baz', 'qux'], 'd:/baz/qux'],
    [['/foo/bar', 'http://example.com', 'file'], 'http://example.com/file'],
  ] as [string[], string][]).forEach(([args, result]) => {
    it(`resolves "${args}"`, () => {
      expect(fuzzyPath.resolve(...args)).toEqual(result);
    });
  });
});
