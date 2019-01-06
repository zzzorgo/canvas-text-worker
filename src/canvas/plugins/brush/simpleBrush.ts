import { IIndexedCanvasElement } from '../../CanvasElement';
import { RectCanvasElement } from '../../elements/RectCanvasElement';

export function simpleBrushPlugin(element: IIndexedCanvasElement, highlightedElements: number[]) {
    const highlight = new RectCanvasElement();

    if (highlightedElements.includes(element.index)) {
        highlight.rect = element.rect;       
        highlight.fillStyle = 'yellow';
        highlight.alpha = 0.3;
    }

    return highlight;
};