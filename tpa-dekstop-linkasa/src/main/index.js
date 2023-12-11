import { app, shell, BrowserWindow, Tray, nativeImage, Menu, globalShortcut } from 'electron'
import path, { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    },
    icon: join(__dirname, '../../resources/icon.png')
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Shortcut
  globalShortcut.register('CommandOrControl+0', () => {
    app.quit()
  })

  globalShortcut.register('CommandOrControl+1', () => {
    if(mainWindow.isMinimized())
      mainWindow.restore()
    else
      mainWindow.minimize()
  })

  globalShortcut.register('CommandOrControl+2', () => {
    mainWindow.maximize()
  })

  globalShortcut.register('CommandOrControl+3', () => {
    mainWindow.setFullScreen(true)
  })

  globalShortcut.register('Escape', () => {
    mainWindow.setSize(900, 670, true)
  })

  // globalShortcut.register('Escape', () => {
  //   mainWindow.restore
  // })
}

let tray
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // System tray
  const icon = path.join(__dirname, '../../resources/icon.png')
  tray = new Tray(icon)

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open',  },
    { label: 'Settings',  },
    { label: 'Help',  },
    { label: 'End',  }
  ])

  tray.setContextMenu(contextMenu)
  tray.setToolTip('LinKasa App')
  tray.setTitle('LinKasa App')

  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
