import {app} from 'electron';
import addFolderByCsv from './../controllers/folder/addFolderByCsv';

export default function getMenuTemplate(args) {

  const {models} = args;

  return [
    {
      label: 'App',
      submenu: [
        {
          label: "Import CSV",
          click: () => addFolderByCsv({models})
        },
        {
          label: "Quit",
          accelerator: "Command+Q",
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
    }
  ];
}

