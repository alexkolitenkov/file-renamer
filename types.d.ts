interface ReadDir {
  files?: FileDescription[];
  folders?: FolderDescription[];
  message?: SystemMessage;
}

type SystemMessage = string;

interface Folder {
  name: string;
  size: number;
  webkitRelativePath: string;
  numberOfFiles: number;
  createdAt: string;
  updatedAt: string;
};

interface FileDescription {
  name: string;
  size: number;
  path: string;
  extension: string;
  createdAt: string;
  updatedAt: string;
};


type EventPayloadMapping = {
  selectFolder: ReadDir;
};

interface Window {
  electron: {
    selectFolder: () => ReadDir;
      // readDir: (dirPath: string) => Promise<string[]>,
      // readFile: (filePath: string) => Promise<string>,
      // selectFiles: () => undefined,
      // checkDuplicateFilenames: (dirPath: string, fileToCheck: string) => Promise<boolean>,
      // checkPermission: (filePath: string) => Promise<boolean>,
      // addText: (filePath: string, prefix: string, suffix: string) => Promise<void>,
      // replaceSubstrings: (dirPath: string, oldSubstr: string, newSubstr: string) => Promise<void>,
      // changeFileExtensions: (dirPath: string, newExt: string) => Promise<void>,
      // filterFiles: (dirPath: string, filterCallback: (fileName: string) => boolean) => Promise<string[]>
  };
}
