import React from 'react';

import './App.css';
import SearchField from './components/SearchField';
import LayerInfoBox from './components/LayerInfoBox';
import ButtonGroup from './components/ButtonGroup';

export default function App() {
  return (
    <div className="App">
      <SearchField />
      <LayerInfoBox />
      <ButtonGroup />
    </div>
  );
}
