import { CanvasElement } from 'src/canvas/CanvasElement';
import { CharCanvasElement } from 'src/canvas/elements/CharCanvasElement';
import { simpleBrushPlugin } from 'src/canvas/plugins/brush';
import { SimpleSelectionLayer } from '../layer';

export class CharSimpleSelectionLayer extends SimpleSelectionLayer {
    public prepareObjectModel = (selectedElements: number[]) => {
        const { mainTextElements } = this.props;
        const elements: CanvasElement[] = [];
        
        mainTextElements.forEach(textElement => {
            textElement.children.forEach(charElement => {
                if (charElement instanceof CharCanvasElement) {
                    this.bindEventHandlers(charElement);
                    
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
