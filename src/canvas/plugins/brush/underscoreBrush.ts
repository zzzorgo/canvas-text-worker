import { IIndexedCanvasElement } from '../../CanvasElement';
import { RectCanvasElement } from '../../elements/RectCanvasElement';

export function underscoreBrushPlugin(element: IIndexedCanvasElement, highlightedElements: number[]) {
    const highlight = new RectCanvasElement();

    if (highlightedElements.includes(element.index)) {
        highlight.rect = {
            height: 4,
            width: element.rect.width,
            x: element.rect.x,
            y: element.rect.y + element.rect.height
        };
        highlight.fillStyle = 'black';
        highlight.alpha = 0.5;
    }

    return highlight;
};