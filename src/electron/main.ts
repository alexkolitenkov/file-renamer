import { app, BrowserWindow } from 'electron';
import { getPreloadPath, getUIPath } from './pathResolver.js';
import FileManager from './FileManager.js';
import {isDev } from './util.js';
import * as fs from 'fs'
import * as path from 'path';
import { dialog } from 'electron';
const fileManager = new FileManager(fs, dialog, path);

app.on('ready', () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: getPreloadPath(),
    },
  });
  if (isDev()) {
    mainWindow.loadURL('http://localhost:5123');
  } else {
    mainWindow.loadFile(getUIPath());
  }

  fileManager.selectFolder(mainWindow);
  handleCloseEvents(mainWindow);
});

function handleCloseEvents(mainWindow: BrowserWindow) {
  let willClose = false;

  mainWindow.on('close', (e) => {
    if (willClose) {
      return;
    }
    e.preventDefault();
    mainWindow.hide();
    if (app.dock) {
      app.dock.hide();
    }
  });

  app.on('before-quit', () => {
    willClose = true;
  });

  mainWindow.on('show', () => {
    willClose = false;
  });
}