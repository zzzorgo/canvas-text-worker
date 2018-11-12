import { IIndexedCanvasElement } from '../CanvasElement';
import { RectHighlightCanvasElement } from '../RectHighlightCanvasElement';

export function highlightPlugin(highlightedElements: number[], element: IIndexedCanvasElement) {
    if (highlightedElements.includes(element.index)) {
        const highlight = new RectHighlightCanvasElement();
        highlight.rect = element.rect;

        element.children.push(highlight);
    }
};