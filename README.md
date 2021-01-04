# @halka/zoomable-image

![Bundle Size](https://badgen.net/bundlephobia/minzip/@halka/zoomable-image) ![npm version](https://badgen.net/npm/v/@halka/zoomable-image) ![types](https://badgen.net/npm/types/@halka/zoomable-image) ![license](https://badgen.net/github/license/halka-org/zoomable-image)

> NOTE: This was more or less an experiment and can have edge cases and bugs. Use with CAUTION! If you find any issues please raise them. Thanks!

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
