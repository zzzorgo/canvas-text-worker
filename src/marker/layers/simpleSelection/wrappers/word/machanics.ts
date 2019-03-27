import { CanvasElement } from 'src/canvas/CanvasElement';
import { TextCanvasElement } from 'src/canvas/elements/TextCanvasElement';
import { simpleBrushPlugin } from 'src/canvas/plugins/brush';
import { ISimpleSelectionLayerProps, ISimpleSelectionLayerState } from '../../layer';
import { SimpleSelectionMechanics } from '../../mechanics';

export class WordSelectionMechanics extends SimpleSelectionMechanics {
    public prepareObjectModel = (props: ISimpleSelectionLayerProps, state: ISimpleSelectionLayerState) => {
        const { mainTextElements } = props;
        const { selectedElements } = state;

        const elements: CanvasElement[] = [];
        
        mainTextElements.forEach(textElement => {
            if (textElement instanceof TextCanvasElement) {
                this.bindEventHandlers(props, state, textElement);

                const simpleBrushElement = simpleBrushPlugin(textElement, selectedElements);

                if (simpleBrushElement && simpleBrushElement.rect) {
                    elements.push(simpleBrushElement);
                }
            }
        });

        return elements;
    };
}
