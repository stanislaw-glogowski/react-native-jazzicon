import MersenneTwister from "mersenne-twister";
import { StyleProp, ViewStyle } from "react-native";

export interface IJazziconProps {
  size?: number;
  address?: string;
  seed?: number;
  containerStyle?: StyleProp<ViewStyle>;
}

export interface IJazziconState {
  generator: MersenneTwister.IMersenneTwister;
  colors: string[];
}

export type Colors = string[];
