import * as React from 'react';
import {
  useMemo,
  useState,
  useEffect,
  forwardRef,
  DependencyList,
  useCallback,
} from 'react';
import {
  motion,
  AnimateSharedLayout,
  AnimatePresence,
  MotionProps,
} from 'framer-motion';
import { useMountedState, useKey, useWindowSize } from 'react-use';

interface Dimensions {
  width: number;
  height: number;
}

const getImageDimensions = (src: string): Promise<Dimensions | null> =>
  new Promise(resolve => {
    const image = new Image();
    image.onload = () => {
      resolve({ width: image.width, height: image.height });
    };
    image.onerror = () => {
      resolve(null);
    };

    image.src = src;
  });
function usePromiseMemo<T extends any>(
  callback: () => Promise<T>,
  deps: DependencyList
) {
  const [state, setState] = useState<T>();
  const isMounted = useMountedState();
  useEffect(() => {
    callback().then(value => {
      if (isMounted()) {
        setState(value);
      }
    });
  }, deps);

  return state;
}

const alwaysTrue = () => true;
const useZoomedImage = (src: string, padding = 20) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const zoom = useCallback(() => {
    setIsZoomed(true);
  }, []);
  const unzoom = useCallback(() => {
    setIsZoomed(false);
  }, []);
  useKey(alwaysTrue, unzoom);
  useEffect(() => {
    const scrollListener = () => {
      requestAnimationFrame(unzoom);
    };
    document.addEventListener('scroll', scrollListener, false);

    return () => {
      document.removeEventListener('scroll', scrollListener, false);
    };
  }, []);

  const imageDimensions = usePromiseMemo(() => getImageDimensions(src), [src]);

  const windowDimensions = useWindowSize();

  const dimensions = useMemo(() => {
    if (imageDimensions) {
      const scaleHeight = windowDimensions.height / imageDimensions.height;
      const scaleWidth = windowDimensions.width / imageDimensions.width;

      const effectiveScale = Math.min(scaleHeight, scaleWidth);

      return {
        width: imageDimensions.width * effectiveScale - padding,
        height: imageDimensions.height * effectiveScale - padding,
      };
    }

    return {
      width: 0,
      height: 0,
    };
  }, [windowDimensions, imageDimensions, padding]);

  return {
    zoomState: {
      isZoomed,
      unzoom,
      zoom,
    },
    dimensions,
  };
};

interface ZoomedImageProps {
  src: string;
  alt: string;
  dimensions: Dimensions;
  unzoom: () => void;
}

function ZoomedImage({
  src,
  alt,
  dimensions,
  unzoom,
}: ZoomedImageProps): JSX.Element {
  return (
    <motion.div
      style={{
        position: 'absolute',
        top: window.scrollY,
        left: window.scrollX,
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        zIndex: 2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
        padding: 0,
        cursor: 'zoom-out',
      }}
      onClick={unzoom}
    >
      <motion.div
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          backgroundColor: 'rgba(255,255,255,.90)',
          filter: 'blur(10px)',
          margin: 0,
          padding: 0,
        }}
        initial={{ opacity: 0, visibility: 'hidden' }}
        animate={{ opacity: 1, visibility: 'visible' }}
        exit={{ opacity: 0, visibility: 'hidden' }}
      />
      <motion.img
        style={{ ...dimensions, position: 'relative', zIndex: 3 }}
        layoutId={src}
        src={src}
        alt={alt}
      />
    </motion.div>
  );
}

interface ZoomableImageProps extends React.HTMLProps<HTMLImageElement> {
  zoomedPadding?: number;
}

export const ZoomableImage = forwardRef(
  (
    {
      style,
      src = '',
      alt = '',
      zoomedPadding: padding,
      onClick = () => {},
      ...props
    }: ZoomableImageProps,
    ref: React.ForwardedRef<HTMLImageElement>
  ): JSX.Element => {
    const {
      zoomState: { isZoomed, unzoom, zoom },
      dimensions,
    } = useZoomedImage(src, padding);

    const handleClick = useCallback(
      (event: React.MouseEvent<never, MouseEvent>) => {
        zoom();
        onClick?.(event);
      },
      [onClick]
    );

    return (
      <AnimateSharedLayout type="crossfade">
        <motion.img
          ref={ref as React.Ref<HTMLImageElement>}
          layoutId={src}
          style={{ cursor: 'zoom-in', ...style }}
          alt={alt}
          src={src}
          {...(props as MotionProps)}
          onClick={handleClick}
        />
        <AnimatePresence>
          {isZoomed && (
            <ZoomedImage
              dimensions={dimensions}
              src={src}
              alt={alt}
              unzoom={unzoom}
            />
          )}
        </AnimatePresence>
      </AnimateSharedLayout>
    );
  }
);
