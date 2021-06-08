import React, { memo } from 'react';
import { Divider as DividerElements } from 'react-native-elements';
import { Styles } from '../assets/css/Styles';

const Divider = ({ ...props }) => (
  <DividerElements
    {...props}
  />
);

export default memo(Divider);