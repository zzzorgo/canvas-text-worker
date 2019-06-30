
// tslint:disable:no-console
import { createSelector } from 'reselect';
import { TextCanvasElement } from 'src/canvas/elements/TextCanvasElement';
import { simpleBrushPlugin, underscoreBrushPlugin, HighlightBrusheTypes } from 'src/canvas/plugins/brush';
import { predicateBrushPlugin } from 'src/canvas/plugins/brush/syntax/predicateBrush';
import { subjectBrushPlugin } from 'src/canvas/plugins/brush/syntax/subjectBrush';
import { HighlightingMode } from '../politics';

export const getMainTextElements = (_, props) => props.mainTextElements;
export const getHighlightClickHandler = (_, props) => props.clickHandler;

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
