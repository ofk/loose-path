import path from 'path';
import * as loosePath from '.';

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

const ROOTPATH_TESTCASE = ['/', 'C:/', 'http://example.com', 'http://example.com/'];

describe('basename', () => {
  [...FILE_TESTCASE, ...FILEPATH_TESTCASE, ...DIRPATH_TESTCASE].forEach((arg) => {
    it(`behaves the same as a native method if given "${arg}"`, () => {
      expect(loosePath.basename(arg)).toEqual(path.basename(arg));
    });
  });

  FILE_TESTCASE.forEach((arg) => {
    it(`behaves the same as a native method if given "${arg}" and ".ext"`, () => {
      expect(loosePath.basename(arg, '.ext')).toEqual(path.basename(arg, '.ext'));
    });
  });

  ROOTPATH_TESTCASE.forEach((arg) => {
    it(`returns an empty basename if given "${arg}"`, () => {
      expect(loosePath.basename(arg)).toEqual('');
    });
  });
});

describe('dirname', () => {
  [...FILE_TESTCASE, ...FILEPATH_TESTCASE, ...DIRPATH_TESTCASE].forEach((arg) => {
    it(`behaves the same as a native method if given "${arg}"`, () => {
      expect(loosePath.dirname(arg)).toEqual(path.dirname(arg));
    });
  });

  ROOTPATH_TESTCASE.forEach((arg) => {
    it(`returns a root path if given "${arg}"`, () => {
      expect(loosePath.dirname(arg)).toEqual(arg);
    });
  });
});

describe('extname', () => {
  [...FILE_TESTCASE, ...FILEPATH_TESTCASE, ...DIRPATH_TESTCASE].forEach((arg) => {
    it(`behaves the same as a native method if given "${arg}"`, () => {
      expect(loosePath.extname(arg)).toEqual(path.extname(arg));
    });
  });

  ROOTPATH_TESTCASE.forEach((arg) => {
    it(`returns an empty extname if given "${arg}"`, () => {
      expect(loosePath.extname(arg)).toEqual('');
    });
  });
});

describe('isAbsolute', () => {
  ['/foo/bar', '/baz/..', 'qux/', '.'].forEach((arg) => {
    it(`behaves the same as a native method if given "${arg}"`, () => {
      expect(loosePath.isAbsolute(arg)).toEqual(path.isAbsolute(arg));
    });
  });

  ['C:/foo', 'z:/'].forEach((arg) => {
    it(`expect an absolute path if it has a drive letter "${arg}"`, () => {
      expect(loosePath.isAbsolute(arg)).toEqual(true);
    });
  });

  ['http://example.com'].forEach((arg) => {
    it(`expect an absolute path if it has a protocol schema "${arg}"`, () => {
      expect(loosePath.isAbsolute(arg)).toEqual(true);
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
      expect(loosePath.join(...args)).toEqual(path.join(...args));
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
      expect(loosePath.join(...args)).toEqual(result);
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
      expect(loosePath.join(...args)).toEqual(result);
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
      expect(loosePath.normalize(arg)).toEqual(path.normalize(arg));
    });
  });

  ([
    ['c:/dir//file', 'c:/dir/file'],
    ['c:/../dir/../file', 'c:/file'],
    ['C:\\foo\\bar\\baz\\file.ext', 'C:/foo/bar/baz/file.ext'],
    ['http://example.com//dir//file', 'http://example.com/dir/file'],
    ['http://example.com/../dir/../file', 'http://example.com/file'],
  ] as [string, string][]).forEach(([arg, result]) => {
    it(`returns normalized "${arg}"`, () => {
      expect(loosePath.normalize(arg)).toEqual(result);
    });
  });
});

describe('relative', () => {
  ([
    ['', ''],
    ['', 'file'],
    ['dir', 'file'],
    ['/', '/file'],
    ['/file', '/file'],
    ['/dir', '/file'],
    ['/dir', '/dir/file'],
    ['/dir/', '/dir/file'],
    ['/dir', '/dir/file/'],
    ['/dir/', '/dir/file/'],
    ['/dir/file', '/dir'],
    ['/dir/file/', '/dir'],
    ['/dir/file', '/dir/'],
    ['/dir/file/', '/dir/'],
    ['/dir/hoge/foo/bar/file', '/dir/hoge/baz/qux/file'],
    ['./', './file'],
    ['./dir', './file'],
  ] as [string, string][]).forEach((args) => {
    it(`behaves the same as a native method if given "${args}"`, () => {
      // console.log(args, loosePath.relative(...args));
      expect(loosePath.relative(...args)).toEqual(path.relative(...args));
    });
  });

  ([
    [['c:/dir', 'c:/dir/file'], 'file'],
    [['http://example.com/dir', 'http://example.com/dir/file'], 'file'],
    [['c:/dir', 'd:/dir/file'], 'd:/dir/file'],
    [['c:/dir', 'http://example.org/dir/file'], 'http://example.org/dir/file'],
    [['http://example.com/dir', 'http://example.org/dir/file'], 'http://example.org/dir/file'],
  ] as [[string, string], string][]).forEach(([args, result]) => {
    it(`returns relative path of "${args}"`, () => {
      expect(loosePath.relative(...args)).toEqual(result);
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
      expect(loosePath.resolve(...args)).toEqual(path.resolve(...args));
    });
  });

  ([
    [['foo', 'bar'], 'foo/bar'],
    [['../foo', '../bar'], '../bar'],
    [['c:/foo/bar', 'baz/qux', 'quux'], 'c:/foo/bar/baz/qux/quux'],
    [['c:/foo/bar', '/baz', 'qux'], 'c:/baz/qux'],
    [['c:/foo/bar', 'd:/baz', 'qux'], 'd:/baz/qux'],
    [['c:/foo/bar', 'c:/foo/hoge/piyo'], 'c:/foo/hoge/piyo'],
    [['c:\\foo\\bar', 'baz\\qux', 'quux'], 'c:/foo/bar/baz/qux/quux'],
    [['c:\\foo\\bar', 'd:\\baz', 'qux'], 'd:/baz/qux'],
    [['c:\\foo\\bar', 'c:\\foo\\hoge\\piyo'], 'c:/foo/hoge/piyo'],
    [['/foo/bar', 'http://example.com/dir', 'file'], 'http://example.com/dir/file'],
    [['/foo/bar', 'http://example.com/dir', '/file'], 'http://example.com/file'],
    [
      ['http://example.com/foo/bar', 'http://example.com/foo/hoge/piyo'],
      'http://example.com/foo/hoge/piyo',
    ],
  ] as [string[], string][]).forEach(([args, result]) => {
    it(`resolves "${args}"`, () => {
      expect(loosePath.resolve(...args)).toEqual(result);
    });
  });
});
