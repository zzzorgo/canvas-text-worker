import { FillStyle } from 'src/canvas/constants';
import { IIndexedCanvasElement } from '../../../CanvasElement';
import { RectCanvasElement } from '../../../elements/RectCanvasElement';

export function subjectBrushPlugin(element: IIndexedCanvasElement, fillStyle: FillStyle = 'black') {
    const highlight = new RectCanvasElement();

    highlight.rect = {
        height: 40,
        width: element.rect.width,
        x: element.rect.x,
        y: element.rect.y + element.rect.height
    };
    highlight.fillStyle = fillStyle;
    highlight.alpha = 0;

    const subjectMark = new RectCanvasElement();
    subjectMark.rect = {
        height: 8,
        width: element.rect.width,
        x: element.rect.x,
        y: element.rect.y + element.rect.height
    };
    subjectMark.fillStyle = fillStyle;
    subjectMark.alpha = 0.5;

    highlight.children.push(subjectMark);

    return highlight;
};