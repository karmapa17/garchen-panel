import {app} from 'electron';

export default function getMenuTemplate(mainWindow) {

  return [
    {
      label: 'App',
      submenu: [
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => app.quit()
        },
        {
          label: 'Undo',
          accelerator: 'CmdOrCtrl+Z',
          selector: 'undo:'
        },
        {
          label: 'Redo',
          accelerator: 'Shift+CmdOrCtrl+Z',
          selector: 'redo:'
        },
        {
          type: 'separator'
        },
        {
          label: 'Cut',
          accelerator: 'CmdOrCtrl+X',
          selector: 'cut:'
        },
        {
          label: 'Copy',
          accelerator: 'CmdOrCtrl+C',
          selector: 'copy:'
        },
        {
          label: 'Paste',
          accelerator: 'CmdOrCtrl+V',
          selector: 'paste:'
        },
        {
          label: 'Select All',
          accelerator: 'CmdOrCtrl+A',
          selector: 'selectAll:'
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Reset Zoom',
          role: 'resetzoom'
        },
        {
          label: 'Zoom In',
          role: 'zoomin'
        },
        {
          label: 'Zoom Out',
          role: 'zoomout'
        },
        {
          label: 'Developer Tools',
          click: () => {
            mainWindow.webContents.openDevTools();
          }
        }
      ]
    }
  ];
}

