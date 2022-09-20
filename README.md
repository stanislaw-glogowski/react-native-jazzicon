# React Native Jazzicon

[![NPM version][npm-image]][npm-url]

React Native component for [jazzicon](https://github.com/castle-link/react-native-jazzicon)

Forked from https://github.com/stanislaw-glogowski/react-native-jazzicon

## Installation

```bash
  $ npm i react-native-jazzicon -S
  $ react-native link react-native-svg
```

## Usage

With numeric `seed`:

```js
import Jazzicon from "react-native-jazzicon";

export default class App extends React.Component {
  render() {
    return <Jazzicon size={120} seed={Math.round(Math.random() * 10000000)} />;
  }
}
```

With ethereum `address`:

```js
import Jazzicon from "react-native-jazzicon";

export default class App extends React.Component {
  render() {
    return (
      <Jazzicon
        size={120}
        address={"0x2152220ab60719d6f987f6de1478971c585841c7"}
      />
    );
  }
}
```

## License

The MIT License

[npm-image]: https://badge.fury.io/js/react-native-jazzicon.svg
[npm-url]: https://npmjs.org/package/react-native-jazzicon
