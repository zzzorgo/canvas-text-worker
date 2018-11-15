import { CanvasElement } from '../CanvasElement';
import { FillStyle } from '../constants';
import { RectCanvasElement } from '../elements/RectCanvasElement';

export function hoverPlugin(element: CanvasElement, fillStyle: FillStyle = 'red', alpha: number = 0.3) {
    if (element.getIsHit()) {
        const highlight = new RectCanvasElement();
        highlight.rect = element.rect;
        highlight.fillStyle = fillStyle;
        highlight.alpha = alpha;

        element.children.push(highlight);
    }
};