import { CanvasElement, IIndexedCanvasElement } from 'src/canvas/CanvasElement';
import { TextCanvasElement } from 'src/canvas/elements/TextCanvasElement';
import { simpleBrushPlugin } from 'src/canvas/plugins/brush';
import { SimpleSelectionMechanics } from '../../mechanics';

export class WordSelectionMechanics extends SimpleSelectionMechanics {
    public prepareObjectModel = (mainTextElements: IIndexedCanvasElement[], selectedElements: number[], active: boolean) => {
        const elements: CanvasElement[] = [];
        
        mainTextElements.forEach(textElement => {
            if (textElement instanceof TextCanvasElement) {
                this.bindEventHandlers(selectedElements, textElement, active);

                const simpleBrushElement = simpleBrushPlugin(textElement, selectedElements);

                if (simpleBrushElement && simpleBrushElement.rect) {
                    elements.push(simpleBrushElement);
                }
            }
        });

        return elements;
    };
}
