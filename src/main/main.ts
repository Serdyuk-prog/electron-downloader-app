/* eslint global-require: off, no-console: off, promise/always-return: off */

import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { Progress, File } from 'electron-dl';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

const { dialog } = require('electron');
const { download } = require('electron-dl');
const unhandled = require('electron-unhandled');

unhandled();

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

/**
 * Установка расширений.
 */
const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

/**
 * Создание основного окна.
 */
const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });
};

/**
 * Скачанные файлы
 */
const downloadItems = new Map<string, any>();

/**
 * Download listener.
 */
ipcMain.on('download', async (event, args) => {
  let localItem: any;
  let prevBytes = 0;
  const downloadUrl = args[0];
  const downloadUuid = args[1];
  console.info(
    `Started download from url ${downloadUrl} with uuid ${downloadUuid}`
  );
  if (downloadUrl) {
    try {
      await download(BrowserWindow.getFocusedWindow(), downloadUrl, {
        onProgress: (progress: Progress) => {
          if (localItem.getState() === 'interrupted' && localItem.canResume()) {
            mainWindow!.webContents.send(
              `download-interrupted-${downloadUuid}`,
              progress
            );
            setTimeout(() => localItem.resume(), 5000);
          } else if (progress.transferredBytes !== prevBytes) {
            mainWindow!.webContents.send(
              `download-progress-${downloadUuid}`,
              progress
            );
          }
          prevBytes = progress.transferredBytes;
        },
        onCompleted: (item: File) => {
          mainWindow!.webContents.send(
            `download-complete-${downloadUuid}`,
            item
          );
        },
        onStarted: (item: File) => {
          localItem = item;
          downloadItems.set(downloadUuid, item);
          mainWindow!.webContents.send(
            `download-started-${downloadUuid}`,
            item
          );
        },
        showProgressBar: true,
      });
    } catch (e) {
      await dialog.showMessageBox({
        title: 'Некоректный URL',
        message: 'Файл не найден',
        detail: `${e}`,
      });
    }
  } else {
    mainWindow!.webContents.send('no-url-specified');
  }
});

/**
 * Pause listener.
 */
ipcMain.on('download-pause', async (event, args) => {
  const downloadUuid = args[0];
  if (downloadUuid) {
    console.info(`Pausing item with uuid ${downloadUuid}`);
    const itemToPause = downloadItems.get(downloadUuid);
    itemToPause.pause();
  }
});

/**
 * Unpause listener;
 */
ipcMain.on('download-unpause', async (event, args) => {
  const downloadUuid = args[0];
  if (downloadUuid) {
    console.info(`Resuming download item with uuid ${downloadUuid}`);
    const itemToPause = downloadItems.get(downloadUuid);
    itemToPause.resume();
  }
});

/**
 * Cancellation listener;
 */
ipcMain.on('download-cancel', async (event, args) => {
  const downloadUuid = args[0];
  if (downloadUuid) {
    console.info(`Cancelling download item with uuid ${downloadUuid}`);
    const itemToPause = downloadItems.get(downloadUuid);
    itemToPause.cancel();
  }
  downloadItems.delete(downloadUuid);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
