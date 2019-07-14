// tslint:disable
import * as actionTypes from './actionTypes';
import { HighlightBrusheTypes } from 'src/canvas/plugins/brush';
import { HighlightingMode } from '../constants';

const NOT_SET_START_INDEX = -1;

const intialState = {
    syntaxWords: {},
    dotedWords: {
        0: {},
        2: {},
        4: {},
        6: {},
        8: {},
        10: {},
        12: {},
        14: {},
    },
    currentBrush: HighlightBrusheTypes.NONE,
    startIndex: NOT_SET_START_INDEX,
    highlightingMode: HighlightingMode.STAND_BY,
    hoveredElement: null
};

export const highlightReducer = (state = intialState, action = {}) => {
    switch (action.type) {
        case actionTypes.DOT_CLICKED: {
            const newState  = {...state};
            const {wordIndex} = action;
            
            state.dotedWords[wordIndex].active = !state.dotedWords[wordIndex].active;

            // newState.predicateWords = state.predicateWords.filter(index => index !== action.wordIndex);
            return newState;
        }

        case actionTypes.START_RANGE_SELECTION: {
            if (state.currentBrush !== HighlightBrusheTypes.NONE) {
                const newState = {...state};
                const {wordIndex} = action;

                const alreadyHighlighted = Boolean(state.syntaxWords[wordIndex]) && state.syntaxWords[wordIndex].brushType === state.currentBrush;
                const mode = alreadyHighlighted ? HighlightingMode.REMOVING : HighlightingMode.ADDING;

                newState.startIndex = wordIndex;
                newState.highlightingMode = mode;
                newState.syntaxWords[wordIndex] = {
                    brushType: state.currentBrush,
                    index: wordIndex
                };

                return newState;
            }
            
            return state;
        }

        case actionTypes.CONTINUE_RANGE_SELECTION: {
            const newState = {...state};
            const {element} = action;
            const {startIndex: start, syntaxWords, highlightingMode, currentBrush} = state;
            
            newState.hoveredElement = element;

            if (highlightingMode !== HighlightingMode.STAND_BY) {
                newState.syntaxWords = updateHighlightRequest(start, element.index, highlightingMode, syntaxWords, currentBrush);
            }

            return newState;
        }

        case actionTypes.STOP_RANGE_SELECTION: {
            const newState = {...state};
            const {wordIndex: end} = action;            
            const {startIndex: start, syntaxWords, highlightingMode, currentBrush} = state;

            newState.syntaxWords = updateHighlightRequest(start, end, highlightingMode, syntaxWords, currentBrush);
            newState.highlightingMode = HighlightingMode.STAND_BY;
            newState.startIndex = NOT_SET_START_INDEX;

            return newState;
        }

        case actionTypes.SET_CURRENT_BRUSH: {
            const newState = {...state};
            newState.currentBrush = action.brushType;
            
            return newState;
        }

        case actionTypes.REMOVE_HOVERED_ELEMENT: {
            const newState = {...state};

            newState.hoveredElement = null;

            return newState;
        }
        
        case actionTypes.SET_HOVERED_ELEMENT: {
            const newState = {...state};
            const {element} = action;

            newState.hoveredElement = element;

            return newState;
        }

        default:
            return state;
    }
};

const getChangedHighlightedElements = (end, start) => {
    const changedHighlightedElements = [];

    if (start < end) {
        for (let index = start; index <= end; index++) {
            changedHighlightedElements.push(index);
        }
    } else {
        for (let index = start; index >= end; index--) {
            changedHighlightedElements.push(index);
        }
    }

    return changedHighlightedElements;
};

const updateHighlightRequest = (start, end, highlightingMode, highlightElements, currentBrush) => {
    const changedIndexes = getChangedHighlightedElements(start, end);

    const newHighlightElements = { ...highlightElements };

    if (highlightingMode === HighlightingMode.ADDING) {
        for (const index of changedIndexes) {
            newHighlightElements[index] = {index, brushType: currentBrush};
        }
    } else if (highlightingMode === HighlightingMode.REMOVING) {
        for (const index of changedIndexes) {
            delete newHighlightElements[index];
        }
    }

    return newHighlightElements;
};
