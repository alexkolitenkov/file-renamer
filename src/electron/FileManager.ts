/*
File and Folder Operations
- Use the fs module to read, rename, and manipulate files.
- Use Electron's dialog module for folder and file selection dialogs.
*/

/*
Renaming Logic
1. Input Validation:
- Handle duplicate filenames to avoid overwrites.
- Check file permissions.
2. Renaming Rules:
- Add/remove text (prefix, suffix).
- Sequential numbering.
- Replace substrings (e.g., replace spaces with underscores).
- Change file extensions.
*/

/*
File Filters
1. Ability to filter files by:
- File type or extension.
- Filename patterns (regex support).
- Modification date or size.
*/

/*
Preview and Confirmation
- Generate a temporary preview list showing old and new filenames.
- Confirm changes before applying.
*/

/*
Undo/History
- Maintain a rollback option using a log of original filenames.
*/
import { BrowserWindow } from 'electron';
import { ipcWebContentsSend } from './util.js';

class FileManager {
    private fs: typeof import('fs');
    private dialog: typeof import('electron').dialog;
    private path: typeof import('path');

    constructor(fs: typeof import('fs'), dialog: typeof import('electron').dialog, path: typeof import('path')) {
        this.fs = fs;
        this.dialog = dialog;
        this.path = path;
    }

     // File and Folder Operations
     async readDir(dirPath: string[] | undefined): Promise<ReadDir>{
        if (dirPath === undefined) return {
            files: [],
            folders: []
        };

        const contents = await this.fs.promises.readdir(dirPath[0], { withFileTypes: true });

        const files = await Promise.all(contents
            .filter(item => !item.isDirectory())
            .map(async item => {
                const filePath = this.path.join(dirPath[0], item.name);
                const stats = await this.fs.promises.stat(filePath);

                return {
                    name: item.name,
                    size: stats.size,
                    path: filePath,
                    extension: this.path.extname(item.name),
                    createdAt: stats.birthtime.toISOString(),
                    updatedAt: stats.mtime.toISOString()
                };
            }));

        const folders = await Promise.all(contents
            .filter(item => item.isDirectory())
            .map(async item => {
                const folderPath = this.path.join(dirPath[0], item.name);
                const stats = await this.fs.promises.stat(folderPath);

                const subContents = await this.fs.promises.readdir(folderPath);

                return {
                    name: item.name,
                    size: stats.size,
                    webkitRelativePath: folderPath,
                    numberOfFiles: subContents.length,
                    createdAt: stats.birthtime.toISOString(),
                    updatedAt: stats.mtime.toISOString()
                };
            }));

        return { 
            files, 
            folders 
        };
    }

    async openDefaultFolder() {
        
    }

    async selectFolder(mainWindow: BrowserWindow): Promise<void> {
        const result = this.dialog.showOpenDialogSync({ properties: ['openDirectory']});
        if (result === undefined) {
            return ipcWebContentsSend('selectFolder', mainWindow.webContents, {
                message:  'Operation cancelled'
            })    
        }
        
        const { files, folders } = await this.readDir(result);
        ipcWebContentsSend('selectFolder', mainWindow.webContents, {
            files,
            folders
        })
    }

    // async readFile(path: string): Promise<string> {
    //     return this.fs.promises.readFile(path, 'utf-8');
        // }

    // selectFiles(): string[] | undefined {
    //     const result = this.dialog.showOpenDialogSync({ properties: ['openFile', 'multiSelections']})
    //     return result || undefined;
    // }

    // // Renaming Logic
    // async checkDuplicateFilenames(dirPath: string, fileToCheck: string): Promise<boolean> {
    //     const files : string [] = await this.readDir(dirPath);
    //     return files.filter(file => file === fileToCheck).length > 1;
    // }

    // checkPermission (path: string): Promise<boolean> {
    //     return new Promise(resolve => {
    //         this.fs.access(path, this.fs.constants.R_OK | this.fs.constants.W_OK, err => {
    //             resolve(!err);
    //         });
    //     });
    // }

    // async addText(path: string, prefix: string = '', suffix: string = ''): Promise<void> {
    //     const newPath = this.path.join(this.path.dirname(path), prefix + this.path.basename(path) + suffix);
    //     await this.fs.promises.rename(path, newPath);
    // }

    // async replaceSubstrings(dirPath: string, oldSubstr: string, newSubstr: string): Promise<void> {
    //     const files: string[] = await this.readDir(dirPath);
    //     for (const file of files) {
    //         const filePath = this.path.join(dirPath, file);
    //         const newFileName = file.replace(oldSubstr, newSubstr);
    //         const newPath = this.path.join(dirPath, newFileName);
    //         await this.fs.promises.rename(filePath, newPath);
    //     }
    // }

    // async changeFileExtensions(dirPath: string, newExt: string): Promise<void> {
    //     const files: string[] = await this.readDir(dirPath);
    //     for (const file of files) {
    //         const filePath = this.path.join(dirPath, file);
    //         const newFileName = this.path.basename(file, this.path.extname(file)) + newExt;
    //         const newPath = this.path.join(dirPath, newFileName);
    //         await this.fs.promises.rename(filePath, newPath);
    //     }
    // }

    // /* Most probably filterType should be ENUM with different filter types
    //     export enum FILTER_TYPES {
    //     //     DATE = 'DATE',
    //     //     SUBSTR = 'SUBSTR',
    //     //     EXTENSION = 'EXTENSION',
    //     //     SIZE = 'SIZE'
    //     // } 
    // */
   
    // // File Filters
    // async filterFiles(dirPath: string, filterCallback: (fileName: string) => boolean): Promise<string[]> {
    //     const files: string[] = await this.readDir(dirPath);
    //     return files.filter(filterCallback);
    // }
}
export default FileManager;

