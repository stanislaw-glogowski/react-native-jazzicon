import * as React from "react";
import { StyleSheet, View } from "react-native";
import { Svg, Rect } from "react-native-svg";
import * as MersenneTwister from "mersenne-twister";
import * as Color from "color";
import { colors, shapeCount, wobble } from "./constants";
import { IReactNativeJazziconProps, IReactNativeJazziconState } from "./interfaces";

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
});

/**
 * React Native Jazzicon
 */
export default class ReactNativeJazzicon extends React.Component<IReactNativeJazziconProps, IReactNativeJazziconState> {

  private static propsToState({ seed, address }: IReactNativeJazziconProps): IReactNativeJazziconState {
    if (address) {
      address = address.toLowerCase();

      if (address.startsWith("0x")) {
        seed = parseInt(address.slice(2, 10), 16);
      }
    }

    const generator = new MersenneTwister(seed);
    const amount = (generator.random() * 30) - (wobble / 2);
    return {
      generator,
      colors: colors.map((hex) => (new Color(hex)).rotate(amount).hex()),
    };
  }

  public state: IReactNativeJazziconState = ReactNativeJazzicon.propsToState(this.props);

  public componentWillReceiveProps(props: IReactNativeJazziconProps) {
    this.setState(
      ReactNativeJazzicon.propsToState(props),
    );
  }

  public render() {
    const { containerStyle, size } = this.props;

    return (
      <View
        style={[
          styles.container, {
            width: size,
            height: size,
            backgroundColor: this.randomColor,
            borderRadius: size / 2,
          },
          containerStyle,
        ]}
      >
        <Svg
          width={size}
          height={size}
        >
          {Array(shapeCount)
            .fill(0)
            .map((_, index) => {
              const center = size / 2;

              const firstRot = this.randomNumber;
              const angle = Math.PI * 2 * firstRot;
              const velocity = size / shapeCount * this.randomNumber + (index * size / shapeCount);

              const tx = Math.cos(angle) * velocity;
              const ty = Math.sin(angle) * velocity;

              const secondRot = this.randomNumber;
              const rot = (firstRot * 360) + secondRot * 180;

              return (
                <Rect
                  key={`shape_${index}`}
                  x={0}
                  y={0}
                  width={size}
                  height={size}
                  fill={this.randomColor}
                  transform={`translate(${tx} ${ty}) rotate(${rot.toFixed(1)} ${center} ${center})`}
                />
              );
            })
          }
        </Svg>
      </View>
    );
  }

  private get randomNumber(): number {
    const { generator } = this.state;
    return generator.random();
  }

  private get randomColor(): string {
    const { colors } = this.state;

    /* tslint:disable-next-line:no-unused-expression */
    this.randomNumber;

    return colors
      .splice(
        Math.floor(colors.length * this.randomNumber),
        1,
      )[ 0 ];
  }
}
