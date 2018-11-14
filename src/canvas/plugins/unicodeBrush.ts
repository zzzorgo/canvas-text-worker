import { ICanvasParams } from '../CanvasElement';
import { CharCanvasElement } from '../elements/CharCanvasElement';
import { getElementsFromText, getTextParams } from '../utils/objectModel';

export function unicodeBrushPlugin(element: CharCanvasElement, highlightedElements: number[], canvasParams: ICanvasParams) {
    if (highlightedElements.includes(element.index)) {
        const text = element.rawChar.charCodeAt(0).toString();
        const highlight = getElementsFromText(canvasParams, getTextParams(text, 20, {x: element.rect.x, y: element.rect.y - 20}));

        element.children.push(...highlight);
    }
};