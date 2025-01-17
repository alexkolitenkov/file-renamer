const electron = require('electron');
const FileManager = require('./FileManager').default;
const fs = require('fs');
const path = require('path');
const { dialog } = require('electron');

const fileManager = new FileManager(fs, dialog, path);

electron.contextBridge.exposeInMainWorld('electron', {
  // readDir: (dirPath: string) => fileManager.readDir(dirPath),
  // readFile: (filePath: string) => fileManager.readFile(filePath),
  selectFolder: (callback) => ipcOn('selectFolder', (contents) => {
    callback(contents)
  })
  // selectFiles: () => fileManager.selectFiles(),
  // checkDuplicateFilenames: (dirPath: string, fileToCheck: string) => fileManager.checkDuplicateFilenames(dirPath, fileToCheck),
  // checkPermission: (filePath: string) => fileManager.checkPermission(filePath),
  // addText: (filePath: string, prefix: string, suffix: string) => fileManager.addText(filePath, prefix, suffix),
  // replaceSubstrings: (dirPath: string, oldSubstr: string, newSubstr: string) => fileManager.replaceSubstrings(dirPath, oldSubstr, newSubstr),
  // changeFileExtensions: (dirPath: string, newExt: string) => fileManager.changeFileExtensions(dirPath, newExt),
  // filterFiles: (dirPath: string, filterCallback: (fileName: string) => boolean) => fileManager.filterFiles(dirPath, filterCallback),
}) satisfies Window['electron'];

function ipcInvoke<Key extends keyof EventPayloadMapping>(
  key: Key
): Promise<EventPayloadMapping[Key]> {
  return electron.ipcRenderer.invoke(key);
}

function ipcOn<Key extends keyof EventPayloadMapping>(
  key: Key,
  callback: (payload: EventPayloadMapping[Key]) => void
) {
  const cb = (_: Electron.IpcRendererEvent, payload: any) => callback(payload);
  electron.ipcRenderer.on(key, cb);
  return () => electron.ipcRenderer.off(key, cb);
}

function ipcSend<Key extends keyof EventPayloadMapping>(
  key: Key,
  payload: EventPayloadMapping[Key]
) {
  electron.ipcRenderer.send(key, payload);
}