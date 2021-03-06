export const VIEW_PORT_SCALE = 2;
export const INITIAL_CANVAS_HEIGHT = 600 * VIEW_PORT_SCALE;

export const TEXT = `Lorem ipsum dolor sit amet, consect-etur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Ну и что-то на кириллице***`;

export type MouseEvent = React.MouseEvent<HTMLElement>;
export type FillStyle = string | CanvasGradient | CanvasPattern;

export const BACKGROUND_COLOR = 'silver';
export const TEXT_COLOR = 'black';

export function getFontSetting(fontSize: number) {
    return `normal normal 100 ${fontSize}px/1 'Calibri'`;
}
