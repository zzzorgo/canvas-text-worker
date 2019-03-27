import { FillStyle } from 'src/canvas/constants';
import { IIndexedCanvasElement } from '../../CanvasElement';
import { RectCanvasElement } from '../../elements/RectCanvasElement';

export function underscoreBrushPlugin(element: IIndexedCanvasElement, highlightedElements: number[], fillStyle: FillStyle = 'black') {
    const highlight = new RectCanvasElement();

    if (highlightedElements.includes(element.index)) {
        highlight.rect = {
            height: 40,
            width: element.rect.width,
            x: element.rect.x,
            y: element.rect.y + element.rect.height
        };
        highlight.fillStyle = fillStyle;
        highlight.alpha = 0.5;
    }

    return highlight;
};