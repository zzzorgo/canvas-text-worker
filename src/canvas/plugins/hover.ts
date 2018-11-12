import { IIndexedCanvasElement } from '../CanvasElement';
import { RectHighlightCanvasElement } from '../elements/RectHighlightCanvasElement';

export function hoverPlugin(element: IIndexedCanvasElement) {
    if (element.getIsHit()) {
        const highlight = new RectHighlightCanvasElement();
        highlight.rect = element.rect;
        highlight.fillStyle = 'red';
        highlight.alpha = 0.3;

        element.children.push(highlight);
    }
};