// tslint:disable
import * as actionTypes from './actionTypes';
import { HighligtingHelper } from 'src/marker/politics/allPolitic';
import { HighlightingMode } from 'src/marker/politics';

const NOT_SET_START_INDEX = -1;

const intialState = {
    predicateWords: [1, 2, 3],
    subjectWords: [4,5,6],
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
            const newState = {...state};
            const {wordIndex} = action;

            newState.startIndex = wordIndex;
            newState.highlightingMode = helper.startHighlightRequest(wordIndex, newState.predicateWords);
            
            return newState;
        }

        case actionTypes.CONTINUE_RANGE_SELECTION: {
            const newState = {...state};
            const {wordIndex} = action;

            const newHighlightedElements = helper.updateHighlightRequest(wordIndex, state.predicateWords, state.highlightingMode, state.startIndex);
            newState.predicateWords = newHighlightedElements;

            return newState;
        }

        case actionTypes.STOP_RANGE_SELECTION: {
            const newState = {...state};
            const {wordIndex} = action;

            const {mode, newHighlightedElements} = helper.stopHighlightRequest(wordIndex, state.predicateWords, state.highlightingMode, state.startIndex);
            newState.highlightingMode = mode;
            newState.startIndex = NOT_SET_START_INDEX;
            newState.predicateWords = newHighlightedElements;

            return newState;
        }

        default:
            return state;
    }
};
