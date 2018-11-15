import { CircleCanvasElement } from 'src/canvas/elements/CircleCanvasElement';
import { IIndexedCanvasElement } from '../../CanvasElement';

export function dotBrushPlugin(element: IIndexedCanvasElement, highlightedElements: number[]) {
    if (highlightedElements.includes(element.index)) {
        const highlight = new CircleCanvasElement();
        highlight.rect = element.rect;       

        element.children.push(highlight);
    }
};