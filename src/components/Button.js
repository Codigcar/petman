import React, { memo } from 'react';
import { Pressable } from 'react-native';
import { Button as ButtonElements } from 'react-native-elements';
import { Styles } from '../assets/css/Styles';

const Button = ({ buttonStyle, title, onPress, titleStyle, ...props }) => (
  <ButtonElements
    type='outline'
    title={title}
    titleStyle={[{ color: Styles.colors.black, fontSize: 18, fontFamily: Styles.fontAldrichRegular }, titleStyle]}
    onPress={onPress}
    buttonStyle={buttonStyle}
    containerStyle={{ borderRadius: 15 }}
    TouchableComponent={Pressable}
    {...props}
  />
);

export default memo(Button);