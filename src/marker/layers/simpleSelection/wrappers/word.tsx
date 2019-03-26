import { CanvasElement } from 'src/canvas/CanvasElement';
import { TextCanvasElement } from 'src/canvas/elements/TextCanvasElement';
import { simpleBrushPlugin } from 'src/canvas/plugins/brush';
import { SimpleSelectionLayer } from '../layer';

export class WordSimpleSelectionLayer extends SimpleSelectionLayer {
    public prepareObjectModel = (selectedElements: number[]) => {
        const { mainTextElements } = this.props;

        const elements: CanvasElement[] = [];
        
        mainTextElements.forEach(textElement => {
            if (textElement instanceof TextCanvasElement) {
                this.bindEventHandlers(textElement);

                const simpleBrushElement = simpleBrushPlugin(textElement, selectedElements);

                if (simpleBrushElement && simpleBrushElement.rect) {
                    elements.push(simpleBrushElement);
                }
            }
        });

        return elements;
    };
}
