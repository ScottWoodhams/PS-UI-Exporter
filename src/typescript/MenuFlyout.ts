import { entrypoints } from 'uxp';
import photoshop from 'photoshop';
import { CreateLogFile, DeleteLogFile, OpenLogFile } from './Logger';

export type MenuItem = { id: string; label: string; submenu?: MenuItem[]; checked?: boolean; enabled?: boolean };

export let LoggingMenuItem: MenuItem = {
  id: 'logging',
  label: 'Logging',
  submenu: [
    { id: 'enableLogging', label: 'EnableLogging', checked: false },
    { id: 'openLogFile', label: 'OpenLogFile', enabled: true },
  ],
};


export async function MainPanelInvokeMenu(id) {
  // does return a value but not documented
  // noinspection JSVoidFunctionReturnValueUsed
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
      await photoshop.app.showAlert('Thanks for trying this UXP plugin!');
      break;
    default:
      await photoshop.app.showAlert(`${id} feature is not supported`);
  }
}
