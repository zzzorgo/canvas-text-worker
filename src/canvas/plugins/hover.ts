import { CanvasElement, IPoint } from '../CanvasElement';
import { FillStyle } from '../constants';
import { RectCanvasElement } from '../elements/RectCanvasElement';

export function hoverPlugin(element: CanvasElement, pointerPosition: IPoint, fillStyle: FillStyle = 'red', alpha: number = 0.3) {
    const highlight = new RectCanvasElement();

    if (element.setIsHit(pointerPosition.x, pointerPosition.y)) {
        highlight.rect = element.rect;
        highlight.fillStyle = fillStyle;
        highlight.alpha = alpha;
    }
    
    return highlight;
};