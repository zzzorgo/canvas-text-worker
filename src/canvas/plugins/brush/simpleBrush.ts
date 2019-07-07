import { IIndexedCanvasElement } from '../../CanvasElement';
import { RectCanvasElement } from '../../elements/RectCanvasElement';

export function simpleBrushPlugin(element: IIndexedCanvasElement) {
    const highlight = new RectCanvasElement();

    highlight.rect = element.rect;       
    highlight.fillStyle = 'yellow';
    highlight.alpha = 0.3;

    return highlight;
};