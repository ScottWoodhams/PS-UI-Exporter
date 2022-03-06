import { entrypoints } from 'uxp';
import photoshop from 'photoshop';
import {CreateLogFile, DeleteLogFile, OpenLogFile} from './Logger';

export default {
  menuItems: [
    {
      id: 'logging',
      label: 'Logging',
      submenu: [
        { id: 'enableLogging', label: 'EnableLogging', checked: false },
        { id: 'openLogFile', label: 'OpenLogFile', enabled: true },
      ],
    },
    { id: 'about', label: 'About' },
  ],
  async invokeMenu(id) {
    // @ts-ignore
    const { menuItems } = entrypoints.getPanel('MainPanel');

    switch (id) {
      case 'enableLogging':
        menuItems.getItem('enableLogging').checked = !menuItems.getItem('enableLogging').checked;
        if (menuItems.getItem('enableLogging').checked === true) {
          await CreateLogFile();
        } else {
          await DeleteLogFile();
        }
        break;
      case 'openLogFile':
        await OpenLogFile();
        break;
      case 'about':
        photoshop.app.showAlert('Thanks for trying this UXP plugin!');
        break;
      default:
        photoshop.app.showAlert(`${id} feature is not supported`);
    }
  },
};
