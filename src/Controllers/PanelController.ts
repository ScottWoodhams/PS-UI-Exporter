import ReactDOM from 'react-dom';
// todo replace with function for consistency
const PanelController = (component, { menuItems, invokeMenu }) => {
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
};

export default PanelController;
