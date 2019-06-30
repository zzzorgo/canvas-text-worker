
// tslint:disable:no-console
import { createSelector } from 'reselect';
import { TextCanvasElement } from 'src/canvas/elements/TextCanvasElement';
import { simpleBrushPlugin, underscoreBrushPlugin, HighlightBrusheTypes } from 'src/canvas/plugins/brush';
import { predicateBrushPlugin } from 'src/canvas/plugins/brush/syntax/predicateBrush';
import { subjectBrushPlugin } from 'src/canvas/plugins/brush/syntax/subjectBrush';
import { HighlightingMode } from '../politics';

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


const brushMap = {
    [HighlightBrusheTypes.PREDICATE]: predicateBrushPlugin,
    [HighlightBrusheTypes.SUBJECT]: subjectBrushPlugin
};

export const getCurrentBrush = state => state.highlight.currentBrush;
export const getSyntaxWords = state => state.highlight.syntaxWords

export const prepareSyntaxObjectModel = createSelector(
    [getMainTextElements, getSyntaxWords, getHighlightClickHandler],
    (mainTextElements, selectedElements, clickHandler) => {
        const elements = [];
        
        for (const textElement of mainTextElements)
        {
            if (textElement instanceof TextCanvasElement) {
                const selection = selectedElements[textElement.index]; 

                if (selection) {
                    console.log(selection);
                    console.log(brushMap);
                    const brush = brushMap[selection.brushType];
                    const highlightElement = brush(textElement);
                    highlightElement.onClick = () => clickHandler(textElement.index)
                    elements.push(highlightElement);
                }
            }
        }

        return elements;
    }
);

export const getShouldContinueRangeSelection = state => state.highlight.highlightingMode !== HighlightingMode.STAND_BY;
