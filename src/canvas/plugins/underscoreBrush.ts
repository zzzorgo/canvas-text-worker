import { IIndexedCanvasElement } from '../CanvasElement';
import { RectHighlightCanvasElement } from '../elements/RectHighlightCanvasElement';

export function underscoreBrushPlugin(element: IIndexedCanvasElement, highlightedElements: number[]) {
    if (highlightedElements.includes(element.index)) {
        const highlight = new RectHighlightCanvasElement();
        highlight.rect = {
            height: 4,
            width: element.rect.width,
            x: element.rect.x,
            y: element.rect.y + element.rect.height
        };
        highlight.fillStyle = 'black';
        highlight.alpha = 0.5;

        element.children.push(highlight);
    }
};