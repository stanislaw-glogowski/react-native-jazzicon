import * as MersenneTwister from "mersenne-twister";
import { StyleProp, ViewStyle } from "react-native";

export interface IReactNativeJazziconProps {
  size?: number;
  address?: string;
  seed?: number;
  containerStyle?: StyleProp<ViewStyle>;
}

export interface IReactNativeJazziconState {
  generator: MersenneTwister.IMersenneTwister;
  colors: string[];
}
