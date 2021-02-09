export interface Directory {
  path: string;
  dirs: string[];
  files: FileInfo[];
}

export interface FileInfo {
  name: string;
  size: string;
}
