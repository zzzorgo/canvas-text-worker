import { CircleCanvasElement } from 'src/canvas/elements/CircleCanvasElement';
import { IIndexedCanvasElement } from '../../CanvasElement';

export function dotBrushPlugin(element: IIndexedCanvasElement, active: boolean) {
        const highlight = new CircleCanvasElement();

        if (active) {
            highlight.fillStyle = '#4277c8';
        }

        const radius = 28;

        highlight.rect = {
            x: element.rect.x + element.rect.width / 2 - radius,
            y: element.rect.y - radius,
            width: 2 * radius,
            height: 2 * radius
        };       

        return highlight;
};