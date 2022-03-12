import React from 'react';
import { useState } from 'react';

const ComponentDialog = ({ dialog }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const buttonHandler = reason => {
    const retObj = { reason, credentials: { username, password } };
    setUsername('');
    setPassword('');
    dialog.close(retObj);
  };

  return (
    <form method="dialog" className="aboutDialog">
      <div className="column">
        <sp-textfield value={username} tabindex={0} onInput={event => setUsername(event.target.value)}>
          <sp-label slot="label">ID</sp-label>
        </sp-textfield>
        <sp-textfield type="password" value={password} tabindex={1} onInput={event => setPassword(event.target.value)}>
          <sp-label slot="label">Password</sp-label>
        </sp-textfield>
        <sp-button-group>
          <sp-button tabindex={2} variant="secondary" quiet="quiet" onClick={() => buttonHandler('reasonCanceled')}>
            Cancel
          </sp-button>
          <sp-button tabindex={3} autofocus="autofocus" variant="primary" onClick={() => buttonHandler('OK')}>
            OK
          </sp-button>
        </sp-button-group>
      </div>
    </form>
  );
};
export default ComponentDialog;
