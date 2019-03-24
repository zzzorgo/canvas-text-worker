import * as React from 'react';
import { CanvasElement } from 'src/canvas/CanvasElement';
import { TextCanvasElement } from 'src/canvas/elements/TextCanvasElement';
import { underscoreBrushPlugin } from 'src/canvas/plugins/brush';
import { ISimpleSelectionLayerProps, SimpleSelectionLayer } from '../layer';

interface ISentenceSyntaxLayerProps {
    mainTextElements: TextCanvasElement[],
    active: boolean
}

export const sentenceSyntaxObjectModelProvider = (SimpleSelectionComponent: React.ComponentType<ISimpleSelectionLayerProps>) =>
        (props: ISentenceSyntaxLayerProps) => {

        const prepareObjectModel = (selectedElements: number[], bindEventHandlers: (element: CanvasElement) => void) => {
                const { mainTextElements } = props;
        
                const elements: CanvasElement[] = [];
                
                mainTextElements.forEach(textElement => {
                    if (textElement instanceof TextCanvasElement) {
                        bindEventHandlers(textElement);
        
                        const simpleBrushElement = underscoreBrushPlugin(textElement, selectedElements);
        
                        if (simpleBrushElement && simpleBrushElement.rect) {
                            elements.push(simpleBrushElement);
                        }
                    }
                });
        
                return elements;
            };

    return <SimpleSelectionComponent {...props} prepareObjectModel={prepareObjectModel}/>
};

export const SentenceSyntaxLayer = sentenceSyntaxObjectModelProvider(SimpleSelectionLayer);
