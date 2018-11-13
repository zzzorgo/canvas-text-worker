import { CanvasElement } from '../CanvasElement';
import { FillStyle } from '../constants';
import { RectHighlightCanvasElement } from '../elements/RectHighlightCanvasElement';

export function hoverPlugin(element: CanvasElement, fillStyle: FillStyle = 'red', alpha: number = 0.3) {
    if (element.getIsHit()) {
        const highlight = new RectHighlightCanvasElement();
        highlight.rect = element.rect;
        highlight.fillStyle = fillStyle;
        highlight.alpha = alpha;

        element.children.push(highlight);
    }
};