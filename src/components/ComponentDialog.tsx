import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Spectrum from 'react-uxp-spectrum';

export type CompDialogProps = { dialog: HTMLDialogElement };

export default function ComponentDialog({ dialog }: CompDialogProps) {
  const [ID, setID] = useState('');

  const buttonHandler = reason => {
    const retObj = { reason, ID };
    setID('');
    dialog.close(retObj);
  };

  return (
    <form method="dialog">
      <sp-heading>Set Component?</sp-heading>
      <Spectrum.Divider size="large" />
      <sp-body>Set the layer with the appropriate ID. This will not export this layer and all its children.</sp-body>
      <Spectrum.Textfield placeholder="Type ID here..." onInput={event => setID(event.target.value)} />
      <footer>
        <Spectrum.Button variant="secondary" quiet onClick={() => buttonHandler('Cancel')}>
          Cancel
        </Spectrum.Button>
        <Spectrum.Button variant="cta" onClick={() => buttonHandler('Confirm')}>
          Set
        </Spectrum.Button>
      </footer>
    </form>
  );
}

export async function OpenComponentDialog() {
  const componentDialog = document.createElement('dialog');
  ReactDOM.render(<ComponentDialog dialog={componentDialog} />, componentDialog);

  document.body.appendChild(componentDialog);

  // @ts-ignore
  const result = await componentDialog.uxpShowModal({
    title: 'Please set component id...',
    resize: 'both',
    size: {
      width: 480,
      height: 240,
    },
  });

  return result;
}
