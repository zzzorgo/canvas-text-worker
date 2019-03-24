import * as React from 'react';
import { CanvasElement } from 'src/canvas/CanvasElement';
import { CharCanvasElement } from 'src/canvas/elements/CharCanvasElement';
import { TextCanvasElement } from 'src/canvas/elements/TextCanvasElement';
import { simpleBrushPlugin } from 'src/canvas/plugins/brush';
import { ISimpleSelectionLayerProps, SimpleSelectionLayer } from '../layer';

interface ICharSimpleSelectionLayerProps {
    mainTextElements: TextCanvasElement[],
    active: boolean
}

export const charSelectionObjectModelProvider = (SimpleSelectionComponent: React.ComponentType<ISimpleSelectionLayerProps>) =>
        (props: ICharSimpleSelectionLayerProps) => {

        const prepareObjectModel = (selectedElements: number[], bindEventHandlers: (element: CanvasElement) => void) => {
            const { mainTextElements } = props;
            const elements: CanvasElement[] = [];
            
            mainTextElements.forEach(textElement => {
                textElement.children.forEach(charElement => {
                    if (charElement instanceof CharCanvasElement) {
                        bindEventHandlers(charElement);
                        
                        const simpleBrushElement = simpleBrushPlugin(charElement, selectedElements);

                        if (simpleBrushElement && simpleBrushElement.rect) {
                            elements.push(simpleBrushElement);
                        }
                    }
                });
            });

            return elements;
        };

    return <SimpleSelectionComponent {...props} prepareObjectModel={prepareObjectModel}/>
};

export const CharSimpleSelectionLayer = charSelectionObjectModelProvider(SimpleSelectionLayer);
