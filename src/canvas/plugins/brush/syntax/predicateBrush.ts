import { FillStyle } from 'src/canvas/constants';
import { IIndexedCanvasElement } from '../../../CanvasElement';
import { RectCanvasElement } from '../../../elements/RectCanvasElement';

export function predicateBrushPlugin(element: IIndexedCanvasElement, fillStyle: FillStyle = 'green') {
    const highlight = new RectCanvasElement();

    highlight.rect = {
        height: 40,
        width: element.rect.width,
        x: element.rect.x,
        y: element.rect.y + element.rect.height
    };
    highlight.fillStyle = fillStyle;
    highlight.alpha = 0;

    const predicateLineTop = new RectCanvasElement();
    predicateLineTop.rect = {
        height: 8,
        width: element.rect.width,
        x: element.rect.x,
        y: element.rect.y + element.rect.height
    };
    predicateLineTop.fillStyle = fillStyle;
    predicateLineTop.alpha = 0.5;

    const predicateLineBottom = new RectCanvasElement();
    predicateLineBottom.rect = {
        height: 8,
        width: element.rect.width,
        x: element.rect.x,
        y: element.rect.y + element.rect.height + 20
    };
    predicateLineBottom.fillStyle = fillStyle;
    predicateLineBottom.alpha = 0.5;

    highlight.children.push(predicateLineTop, predicateLineBottom);

    return highlight;
};