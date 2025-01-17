import React, { useState } from 'react';
import { isArrayEmpty } from '../util';
import FileExplorer from './FileExplorer/FileExplorer';
const HomeScreen: React.FC = () => {

  return (
    <>
      <FileExplorer/>
    </>
  );
};

export default HomeScreen;