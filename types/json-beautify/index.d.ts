declare function beautify(obj: any, replacer: Replacer | null | undefined, indent: number | string, maxColumnLength: number): string;
type Replacer = (key: string, value: any) => string;
export = beautify;
