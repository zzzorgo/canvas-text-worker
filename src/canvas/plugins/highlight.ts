import { IIndexedCanvasElement } from '../CanvasElement';
import { RectHighlightCanvasElement } from '../elements/RectHighlightCanvasElement';

export function highlightPlugin(highlightedElements: number[], element: IIndexedCanvasElement) {
    if (highlightedElements.includes(element.index)) {
        const highlight = new RectHighlightCanvasElement();
        highlight.rect = element.rect;       
        highlight.fillStyle = 'yellow';
        highlight.alpha = 0.3;

        element.children.push(highlight);
    }
};