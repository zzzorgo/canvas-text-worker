import { ICanvasParams } from '../../CanvasElement';
import { CharCanvasElement } from '../../elements/CharCanvasElement';
import { CanvasObjectModel, getTextParams } from '../../utils/objectModel';

export function unicodeBrushPlugin(element: CharCanvasElement, highlightedElements: number[], canvasParams: ICanvasParams) {
    if (highlightedElements.includes(element.index)) {
        const FONT_SIZE = 20;
        const text = element.rawChar.charCodeAt(0).toString();
        const textParams = getTextParams(text, FONT_SIZE, {x: element.rect.x, y: element.rect.y - FONT_SIZE});
        const com = new CanvasObjectModel(canvasParams, textParams);
        const highlight = com.getNodes();

        element.children.push(...highlight);
    }
};