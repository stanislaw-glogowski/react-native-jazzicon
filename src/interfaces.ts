import { StyleProp, ViewStyle } from "react-native";

export interface IJazziconProps {
  size?: number;
  address?: string;
  seed?: number;
  containerStyle?: StyleProp<ViewStyle>;
}

export type Colors = string[];
