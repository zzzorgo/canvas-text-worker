
// tslint:disable
import { createSelector } from 'reselect';
import { TextCanvasElement } from 'src/canvas/elements/TextCanvasElement';
import { simpleBrushPlugin, underscoreBrushPlugin, HighlightBrusheTypes, dotBrushPlugin } from 'src/canvas/plugins/brush';
import { predicateBrushPlugin } from 'src/canvas/plugins/brush/syntax/predicateBrush';
import { subjectBrushPlugin } from 'src/canvas/plugins/brush/syntax/subjectBrush';
import { HighlightingMode } from '../constants';
import { CircleCanvasElement } from 'src/canvas/elements/CircleCanvasElement';

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


export const getDotedWords = state => state.highlight.dotedWords

export const prepareDotObjectModel = createSelector(
    [getMainTextElements, getDotedWords, getHighlightClickHandler],
    (mainTextElements, selectedElements, clickHandler) => {
        const elements = [];

        for (const textElement of mainTextElements)
        {
            if (textElement instanceof TextCanvasElement) {
                const selection = selectedElements[textElement.index]; 

                if (selection) {
                    // const brush = brushMap[selection.brushType];
                    const highlightElement = dotBrushPlugin(textElement, selection.active);
                    highlightElement.onClick = () => clickHandler(textElement.index);
                    elements.push(highlightElement);
                }
            }
        }

        return elements;
    }
);
