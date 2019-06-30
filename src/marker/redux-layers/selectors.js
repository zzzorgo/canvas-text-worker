
// tslint:disable:no-console
import { createSelector } from 'reselect';
import { TextCanvasElement } from 'src/canvas/elements/TextCanvasElement';
import { simpleBrushPlugin, underscoreBrushPlugin } from 'src/canvas/plugins/brush';

export const getPredicateWords = state => state.highlight.predicateWords;
export const getSubjectWords = state => state.highlight.subjectWords;
export const getMainTextElements = (_, props) => props.mainTextElements;
export const getHighlightClickHandler = (_, props) => props.clickHandler;

export const prepareObjectModel = (getSelectedElements, brush) => createSelector(
    [getMainTextElements, getSelectedElements, getHighlightClickHandler],
    (mainTextElements, selectedElements, clickHandler) => {
        const elements = [];
        
        for (const textElement of mainTextElements)
        {
            if (textElement instanceof TextCanvasElement) {
                const simpleBrushElement = brush(textElement, selectedElements);
                simpleBrushElement.onClick = () => clickHandler(textElement.index)

                if (simpleBrushElement && simpleBrushElement.rect) {
                    elements.push(simpleBrushElement);
                }
            }
        }

        return elements;
    }
);

export const getPredicateObjectModel = prepareObjectModel(getPredicateWords, underscoreBrushPlugin);
export const getSubjectObjectModel = prepareObjectModel(getSubjectWords, simpleBrushPlugin);
