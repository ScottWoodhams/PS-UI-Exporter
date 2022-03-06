import ReactDOM from 'react-dom';
import {CreateLogFile} from "../typescript/Logger";

const PanelController = (component, { menuItems, invokeMenu }) => {
  console.log(component);
  let root = null;
  let attachment = null;

  const controller = {
   async create() {
      root = document.createElement('div');
      root.style.height = '100vh';
      root.style.overflow = 'auto';
      root.style.padding = '10px 20px';
      ReactDOM.render(component, root);
      console.log('Panel created');
    },

    destroy() {
      console.log('Panel destroyed');
    },

    show({ node }) {
      if (!root) {
        controller.create();
      }
      if (!attachment) {
        attachment = node; // the body
        attachment.appendChild(root);
      }
      console.log('Panel shown');
    },

    hide() {
      if (attachment && root) {
        attachment.removeChild(root);
        attachment = null;
      }
      console.log('Panel hidden');
    },

    menuItems,
    invokeMenu,
  };

  return controller;
};

export default PanelController;
