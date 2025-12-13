// useResponsive.ts
import { useWindowDimensions, PixelRatio } from 'react-native';

const BASE_WIDTH = 375;

export function useResponsiveScaling() {
    const { width, height } = useWindowDimensions();
    const fontScale = PixelRatio.getFontScale();

    const isTablet = width >= 768;

    const scale = (size: number) =>
        Math.round(size * Math.min(width / BASE_WIDTH, isTablet ? 1.4 : 1.2));

    const font = (size: number) =>
        Math.round(size * Math.min(fontScale, 1.3));

    return {
        width,
        height,
        isTablet,
        scale,
        font,
    };
}
