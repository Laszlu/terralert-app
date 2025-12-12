import { View, type ViewProps } from 'react-native';

import {useMyTheme} from "@/hooks/useCustomTheme";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
    const {colors} = useMyTheme()
  const backgroundColor = colors.background;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
