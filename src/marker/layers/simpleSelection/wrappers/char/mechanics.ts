import { CanvasElement } from 'src/canvas/CanvasElement';
import { CharCanvasElement } from 'src/canvas/elements/CharCanvasElement';
import { simpleBrushPlugin } from 'src/canvas/plugins/brush';
import { ISimpleSelectionLayerProps, ISimpleSelectionLayerState } from '../../layer';
import { SimpleSelectionMechanics } from '../../mechanics';

export class CharSelectionMechanics extends SimpleSelectionMechanics {
    public prepareObjectModel = (props: ISimpleSelectionLayerProps, state: ISimpleSelectionLayerState) => {
        const { mainTextElements } = props;
        const { selectedElements } = state;

        const elements: CanvasElement[] = [];
        
        mainTextElements.forEach(textElement => {
            textElement.children.forEach(charElement => {
                if (charElement instanceof CharCanvasElement) {
                    this.bindEventHandlers(props, state, charElement);
                    
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
