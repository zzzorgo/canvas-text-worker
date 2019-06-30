// tslint:disable
import * as actionTypes from './actionTypes';
import { HighligtingHelper } from 'src/marker/politics/allPolitic';
import { HighlightingMode } from 'src/marker/politics';
import { HighlightBrusheTypes } from 'src/canvas/plugins/brush';

const NOT_SET_START_INDEX = -1;

const intialState = {
    predicateWords: [1, 2, 3],
    subjectWords: [4,5,6],
    syntaxWords: {},
    currentBrush: HighlightBrusheTypes.NONE,
    startIndex: NOT_SET_START_INDEX,
    highlightingMode: HighlightingMode.STAND_BY
};

const helper = new HighligtingHelper();

export const highlightReducer = (state = intialState, action = {}) => {
    switch (action.type) {
        case actionTypes.SELECTION_CLICKED: {
            const newState  = {...state};

            newState.predicateWords = state.predicateWords.filter(index => index !== action.wordIndex);
            return newState;
        }

        // case LEAVE_WORD: {
        //     const newState = {...state};
        //     newState.selectedWords = state.selectedWords.filter(index => index !== action.wordIndex);
        //     return newState;
        // }
    
        // case ENTER_WORD: {
        //     const newState = {...state};
        //     newState.selectedWords = [...state.selectedWords, action.wordIndex];
        //     return newState;
        // }

        case actionTypes.START_RANGE_SELECTION: {
            
            // newState.startIndex = wordIndex;
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
            const {wordIndex: end} = action;
            const {startIndex: start} = state;

            const changedIndexes = helper.getChangedHighlightedElements(start, end);

            newState.syntaxWords = {...state.syntaxWords};

            if (state.highlightingMode === HighlightingMode.ADDING) {
                for (const index of changedIndexes) {
                    newState.syntaxWords[index] = {index, brushType: state.currentBrush};
                }
            } else if (state.highlightingMode === HighlightingMode.REMOVING) {
                for (const index of changedIndexes) {
                    delete newState.syntaxWords[index];
                }
            }

            return newState;
        }

        case actionTypes.STOP_RANGE_SELECTION: {
            const newState = {...state};
            const {wordIndex} = action;
            
            const end = wordIndex;
            const start = state.startIndex;

            const changedIndexes = helper.getChangedHighlightedElements(start, end);

            newState.syntaxWords = {...state.syntaxWords};

            if (state.highlightingMode === HighlightingMode.ADDING) {
                for (const index of changedIndexes) {
                    newState.syntaxWords[index] = {index, brushType: state.currentBrush};
                }
            } else if (state.highlightingMode === HighlightingMode.REMOVING) {
                for (const index of changedIndexes) {
                    delete newState.syntaxWords[index];
                }
            }

            newState.highlightingMode = HighlightingMode.STAND_BY;
            newState.startIndex = NOT_SET_START_INDEX;
            // newState.predicateWords = newHighlightedElements;

            return newState;
        }

        case actionTypes.SET_CURRENT_BRUSH: {
            const newState = {...state};
            newState.currentBrush = action.brushType;
            
            return newState;
        }

        default:
            return state;
    }
};
