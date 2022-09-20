import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Svg, Rect } from "react-native-svg";
import * as MersenneTwister from "mersenne-twister";
import * as Color from "color";
import { colors, shapeCount, wobble } from "./constants";
import { IJazziconProps, IJazziconState } from "./interfaces";

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
});

const propsToState = ({ seed, address }: IJazziconProps): IJazziconState => {
  if (address) {
    address = address.toLowerCase();

    if (address.startsWith("0x")) {
      seed = parseInt(address.slice(2, 10), 16);
    }
  }

  const generator = new MersenneTwister(seed);
  const amount = generator.random() * 30 - wobble / 2;
  return {
    generator,
    colors: colors.map((hex) => new Color(hex).rotate(amount).hex()),
  };
};

/**
 * React Native Jazzicon
 */
export const Jazzicon = (props: IJazziconProps) => {
  // const [state, setState] = React.useState<IJazziconState>()

  const { generator, colors } = useMemo(() => propsToState(props), [props]);

  const { containerStyle, size } = props;

  const randomNumber = useMemo(() => generator.random(), [generator]);

  const randomColor = useMemo(() => {
    return colors.splice(Math.floor(colors.length * randomNumber), 1)[0];
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          backgroundColor: randomColor,
          borderRadius: size / 2,
        },
        containerStyle,
      ]}
    >
      <Svg width={size} height={size}>
        {Array(shapeCount)
          .fill(0)
          .map((_, index) => {
            const center = size / 2;

            const firstRot = randomNumber;
            const angle = Math.PI * 2 * firstRot;
            const velocity =
              (size / shapeCount) * randomNumber + (index * size) / shapeCount;

            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;

            const secondRot = randomNumber;
            const rot = firstRot * 360 + secondRot * 180;

            return (
              <Rect
                key={`shape_${index}`}
                x={0}
                y={0}
                width={size}
                height={size}
                fill={randomColor}
                transform={`translate(${tx} ${ty}) rotate(${rot.toFixed(
                  1
                )} ${center} ${center})`}
              />
            );
          })}
      </Svg>
    </View>
  );
};
