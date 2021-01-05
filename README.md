# @halka/zoomable-image

![Bundle Size](https://badgen.net/bundlephobia/minzip/@halka/zoomable-image) ![npm version](https://badgen.net/npm/v/@halka/zoomable-image) ![types](https://badgen.net/npm/types/@halka/zoomable-image) ![license](https://badgen.net/github/license/halka-org/zoomable-image)

A react component to have zoomable images like medium built with framer-motion.

> !! CAUTINARY NOTE: This was more or less an experiment and ~~can~~ will have edge cases and bugs. Also the bundle size is pretty obnoxiously large due to dependencies like framer-motion. Use with CAUTION! If you find any issues please raise them. Thanks!

> Good alternative - [`medium-zoom`](https://github.com/francoischalifour/medium-zoom)
> We have a light but powerful React wrapper on top of the amazing `medium-zoom` library - [`@halka/react-medium-zoom`](https://github.com/halka-org/react-medium-zoom)

## Installation

```sh
npm i @halka/zoomable-image
```

## Usage

```jsx
import { ZoomableImage } from '@halka/zoomable-image';

function App() {
  return (
    <>
      <OtherComponents >
      <ZoomableImage
        src={imgUrl}
        alt="mosque "
        style={{ width: 'auto', height: 400 }}
        /** only custom prop **/
        zoomedPadding={20}
      />
      <OtherComponents >
    </>
  );
}
```

You can pass all valid `HTMLImgElement` props i.e. anything you can pass to `<img>`.

One additional props is `zoomPadding` which is a numeric padding value in `px` units that will be used as padding for the zoomed image.
