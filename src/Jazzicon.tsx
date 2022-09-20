import React, { useCallback, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Svg, Rect } from "react-native-svg";
import * as MersenneTwister from "mersenne-twister";
import { colors, shapeCount, wobble } from "./constants";
import { IJazziconProps } from "./interfaces";
import { colorRotate } from "./colorUtils";

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
});

type Colors = Array<string>;

const hueShift = (
  colors: Colors,
  generator: MersenneTwister.IMersenneTwister
): Array<string> => {
  const amount = generator.random() * 30 - wobble / 2;
  const rotate = (hex: string) => colorRotate(hex, amount);
  return colors.map(rotate);
};

const getGenerator = (seed: number) => {
  const generator = new MersenneTwister(seed);
  return generator;
};

/**
 * React Native Jazzicon
 */
export const Jazzicon = ({
  address,
  seed: providedSeed,
  containerStyle,
  size,
}: IJazziconProps) => {
  const seed = useMemo(() => {
    if (address) {
      const sanitizedAddress = address.toLowerCase();

      if (sanitizedAddress.startsWith("0x")) {
        return parseInt(address.slice(2, 10), 16);
      }
      return providedSeed;
    }
  }, [address, providedSeed]);

  const generator = getGenerator(seed); // regenrate the generator on every render so that the image remains the same

  const genColor = useCallback(
    (colors: Colors): string => {
      const rand = generator.random(); // purposefully call the generator once, before using it again on the next line
      const idx = Math.floor(colors.length * generator.random());
      const color = colors.splice(idx, 1)[0];
      return color;
    },
    [generator]
  );

  const genShape = useCallback(
    (remainingColors: Colors, diameter: number, i: number, total: number) => {
      const center = diameter / 2;
      const firstRot = generator.random();
      const angle = Math.PI * 2 * firstRot;
      const velocity =
        (diameter / total) * generator.random() + (i * diameter) / total;
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity;
      const translate = "translate(" + tx + " " + ty + ")";

      // Third random is a shape rotation on top of all of that.
      const secondRot = generator.random();
      const rot = firstRot * 360 + secondRot * 180;
      const rotate =
        "rotate(" + rot.toFixed(1) + " " + center + " " + center + ")";
      const transform = translate + " " + rotate;
      const fill = genColor(remainingColors);

      return (
        <Rect
          key={`shape_${i}`}
          x="0"
          y="0"
          rx="0"
          ry="0"
          height={diameter}
          width={diameter}
          transform={transform}
          fill={fill}
        />
      );
    },
    [genColor, generator]
  );

  const remainingColors = hueShift(colors.slice(), generator);
  const shapesArr = Array(shapeCount).fill(undefined);

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          backgroundColor: genColor(remainingColors),
          borderRadius: size / 2,
        },
        containerStyle,
      ]}
    >
      <Svg width={size} height={size}>
        {shapesArr.map((_, index) =>
          genShape(remainingColors, size, index, shapeCount - 1)
        )}
      </Svg>
    </View>
  );
};
