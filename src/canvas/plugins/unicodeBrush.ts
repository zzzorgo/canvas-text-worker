import { IIndexedCanvasElement } from '../CanvasElement';
import { RectHighlightCanvasElement } from '../elements/RectHighlightCanvasElement';

export function unicodeBrushPlugin(element: IIndexedCanvasElement, highlightedElements: number[]) {
    if (highlightedElements.includes(element.index)) {
        const highlight = new RectHighlightCanvasElement();
        highlight.rect = {
            height: 10,
            width: 10,
            x: element.rect.x + element.rect.width/2 - 5,
            y: element.rect.y + 12
        };

        element.children.push(highlight);
    }
};