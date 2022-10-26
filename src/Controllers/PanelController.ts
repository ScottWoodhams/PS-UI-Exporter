import ReactDOM from 'react-dom';
import { MenuItem } from '../typescript/MenuFlyout';

export type PanelControllerProps = { menuItems: MenuItem[]; invokeMenu: (id) => Promise<void> };

export default function PanelController(component: JSX.Element, { menuItems, invokeMenu }: PanelControllerProps) {
  let root = null;
  let attachment = null;

  const controller = {
    async create() {
      root = document.createElement('div');
      root.style.height = '100vh';
      root.style.overflow = 'auto';
      ReactDOM.render(component, root);
    },

    show({ node }) {
      if (!root) {
        controller.create();
      }
      if (!attachment) {
        attachment = node;
        attachment.appendChild(root);
      }
    },
    menuItems,
    invokeMenu,
  };

  return controller;
}
