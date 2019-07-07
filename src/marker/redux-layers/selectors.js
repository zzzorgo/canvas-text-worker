
// tslint:disable:no-console
import { createSelector } from 'reselect';
import { TextCanvasElement } from 'src/canvas/elements/TextCanvasElement';
import { simpleBrushPlugin, underscoreBrushPlugin, HighlightBrusheTypes } from 'src/canvas/plugins/brush';
import { predicateBrushPlugin } from 'src/canvas/plugins/brush/syntax/predicateBrush';
import { subjectBrushPlugin } from 'src/canvas/plugins/brush/syntax/subjectBrush';
import { HighlightingMode } from '../constants';

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
        console.log('syntax render');
        const elements = [];

        for (const textElement of mainTextElements)
        {
            if (textElement instanceof TextCanvasElement) {
                const selection = selectedElements[textElement.index]; 

                if (selection) {
                    const brush = brushMap[selection.brushType];
                    const highlightElement = brush(textElement);
                    elements.push(highlightElement);
                }
            }
        }

        return elements;
    }
);

export const getShouldContinueRangeSelection = state => state.highlight.highlightingMode !== HighlightingMode.STAND_BY;

const getHoveredElement = state => state.highlight.hoveredElement;

export const prepareHoverObjectModel = createSelector(
    [getHoveredElement],
    (hoveredElement) => {
        const elements = [];
        
        if (hoveredElement) {
            const highlightElement = simpleBrushPlugin(hoveredElement);
            elements.push(highlightElement);
        }

        return elements;
    }
);
