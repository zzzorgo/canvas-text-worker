import * as React from 'react';
import { CanvasElement } from 'src/canvas/CanvasElement';
import { TextCanvasElement } from 'src/canvas/elements/TextCanvasElement';
import { simpleBrushPlugin } from 'src/canvas/plugins/brush';
import { ISimpleSelectionLayerProps, SimpleSelectionLayer } from '../layer';

interface IWordSimpleSelectionLayerProps {
    mainTextElements: TextCanvasElement[],
    active: boolean
}

export const wordSelectionObjectModelProvider = (SimpleSelectionComponent: React.ComponentType<ISimpleSelectionLayerProps>) =>
        (props: IWordSimpleSelectionLayerProps) => {

        const prepareObjectModel = (selectedElements: number[], bindEventHandlers: (element: CanvasElement) => void) => {
                const { mainTextElements } = props;
        
                const elements: CanvasElement[] = [];
                
                mainTextElements.forEach(textElement => {
                    if (textElement instanceof TextCanvasElement) {
                        bindEventHandlers(textElement);
        
                        const simpleBrushElement = simpleBrushPlugin(textElement, selectedElements);
        
                        if (simpleBrushElement && simpleBrushElement.rect) {
                            elements.push(simpleBrushElement);
                        }
                    }
                });
        
                return elements;
            };

    return <SimpleSelectionComponent {...props} prepareObjectModel={prepareObjectModel}/>
};

export const WordSimpleSelectionLayer = wordSelectionObjectModelProvider(SimpleSelectionLayer);
