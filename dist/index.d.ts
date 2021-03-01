export declare function isAbsolute(path: string): boolean;
export declare function basename(path: string, ext?: string): string;
export declare function dirname(path: string): string;
export declare function extname(path: string): string;
export declare function normalize(path: string): string;
export declare function join(...paths: string[]): string;
export declare function resolve(...paths: string[]): string;
export declare function relative(from: string, to: string): string;
