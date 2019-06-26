
// tslint:disable:no-console
import { createSelector } from 'reselect';
import { TextCanvasElement } from 'src/canvas/elements/TextCanvasElement';
import { simpleBrushPlugin, underscoreBrushPlugin } from 'src/canvas/plugins/brush';

export const getSelectedWords = state => state.highlight.selectedWords;
export const getSelectedWords2 = state => state.highlight.selectedWords2;
export const getMainTextElements = (_, props) => props.mainTextElements;
export const getClickHandler2 = (_, props) => props.clickHandler;

export const prepareObjectModel = createSelector(
    [getMainTextElements, getSelectedWords],
    (mainTextElements, selectedElements) => {
        const elements = [];
        
        mainTextElements.forEach(textElement => {
            if (textElement instanceof TextCanvasElement) {
                // this.bindEventHandlers(selectedElements, textElement, active);

                const simpleBrushElement = simpleBrushPlugin(textElement, selectedElements);

                if (simpleBrushElement && simpleBrushElement.rect) {
                    elements.push(simpleBrushElement);
                }
            }
        });

        return elements;
    }
);


export const prepareObjectModel2 = createSelector(
    [getMainTextElements, getSelectedWords2, getClickHandler2],
    (mainTextElements, selectedElements, clickHandler) => {
        const elements = [];
        
        mainTextElements.forEach(textElement => {
            if (textElement instanceof TextCanvasElement) {
                // this.bindEventHandlers(selectedElements, textElement, active);

                const simpleBrushElement = underscoreBrushPlugin(textElement, selectedElements);
                simpleBrushElement.onClick = () => clickHandler(textElement.index)

                if (simpleBrushElement && simpleBrushElement.rect) {
                    elements.push(simpleBrushElement);
                }
            }
        });

        return elements;
    }
);

