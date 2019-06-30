import { CanvasElement, IIndexedCanvasElement } from 'src/canvas/CanvasElement';
import { CharCanvasElement } from 'src/canvas/elements/CharCanvasElement';
import { simpleBrushPlugin } from 'src/canvas/plugins/brush';
import { SimpleSelectionMechanics } from '../../mechanics';

export class CharSelectionMechanics extends SimpleSelectionMechanics {
    public prepareObjectModel = (mainTextElements: IIndexedCanvasElement[], selectedElements: number[], active: boolean) => {
        const elements: CanvasElement[] = [];
        
        mainTextElements.forEach(textElement => {
            textElement.children.forEach(charElement => {
                if (charElement instanceof CharCanvasElement) {
                    this.bindEventHandlers(selectedElements, charElement, active);
                    
                    const simpleBrushElement = simpleBrushPlugin(charElement, selectedElements);

                    if (simpleBrushElement && simpleBrushElement.rect) {
                        elements.push(simpleBrushElement);
                    }
                }
            });
        });

        return elements;
    };
}
