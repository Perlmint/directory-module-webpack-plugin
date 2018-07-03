// tslint:disable
/**
 * Used to cache a stats object for the virtual file.
 * Based on the `mock-fs` package.
 *
 * @author Tim Schaub http://tschaub.net/
 * @link https://github.com/tschaub/mock-fs/blob/master/lib/binding.js
 * @link https://github.com/tschaub/mock-fs/blob/master/license.md
 */
/* istanbul ignore file */

export interface Stats {
	dev: number;
	nlink: number;
	uid: number;
	gid: number;
	rdev: number;
	blksize: number;
	ino: number;
	mode: number;
	size: number;
	atime: string;
	mtime: string;
	ctime: string;
	birthtime: string;
}

export type StatsCreateOption = Partial<Stats> & {
	contents?: string
};

export class VirtualStats implements Stats {
	public dev: number;
	public nlink: number;
	public uid: number;
	public gid: number;
	public rdev: number;
	public blksize: number;
	public ino: number;
	public mode: number;
	public size: number;
	public atime: string;
	public mtime: string;
	public ctime: string;
	public birthtime: string;

	private constructor(option: Stats) {
		this.dev = option.dev;
		this.nlink = option.nlink;
		this.uid = option.uid;
		this.gid = option.gid;
		this.rdev = option.rdev;
		this.blksize = option.blksize;
		this.ino = option.ino;
		this.mode = option.mode;
		this.size = option.size;
		this.atime = option.atime;
		this.mtime = option.mtime;
		this.ctime = option.ctime;
		this.birthtime = option.birthtime;
	}

	private static statsDate(inputDate?: Date) {
    if (!inputDate) {
      inputDate = new Date();
    }
    return inputDate.toString();
	}

	public static create(options: StatsCreateOption) {
		if (!options) {
			options = {};
		}
		if (!options.ctime) {
			options.ctime = VirtualStats.statsDate();
		}
		if (!options.mtime) {
			options.mtime = VirtualStats.statsDate();
		}
		if (!options.size) {
			options.size = 0;
		}
		if (!options.size && options.contents) {
			options.size = options.contents.length;
		}

		return new VirtualStats({
			dev: 8675309,
			nlink: 1,
			uid: 501,
			gid: 20,
			rdev: 0,
			blksize: 4096,
			ino: 44700000,
			mode: 33188,
			size: options.size,
			atime: options.mtime,
			mtime: options.mtime,
			ctime: options.ctime,
			birthtime: options.ctime,
		});
	}

  isDirectory() {
    return false;
  }

  isFile() {
    return true;
  }

  isBlockDevice() {
    return false;
	}

  isCharacterDevice() {
    return false;
  }

  isSymbolicLink() {
    return false;
  }

  isFIFO() {
    return false;
  }

  isSocket() {
    return false;
  }
}
