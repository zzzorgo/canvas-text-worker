// tslint:disable
import { WORD_CLICKED, SELECTION_CLICKED, LEAVE_WORD, ENTER_WORD, CONTINUE_RANGE_SELECTION, START_RANGE_SELECTION, STOP_RANGE_SELECTION } from './actionTypes';
import { HighligtingHelper } from 'src/marker/politics/allPolitic';
import { HighlightingMode } from 'src/marker/politics';

const NOT_SET_START_INDEX = -1;

const intialState = {
    selectedWords: [1, 2, 3],
    selectedWords2: [4,5,6],
    startIndex: NOT_SET_START_INDEX,
    highlightingMode: HighlightingMode.STAND_BY
};

const helper = new HighligtingHelper();

export const highlightReducer = (state = intialState, action = {}) => {
    switch (action.type) {
        case WORD_CLICKED: {
            const newState = {...state};
            
            newState.selectedWords2 = state.selectedWords2.filter(index => index !== action.wordIndex);

            newState.selectedWords = [...state.selectedWords, action.wordIndex];
            return newState;
        }
        case SELECTION_CLICKED: {
            const newState  = {...state};

            newState.selectedWords2 = state.selectedWords2.filter(index => index !== action.wordIndex);
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

        case START_RANGE_SELECTION: {
            const newState = {...state};
            const {wordIndex} = action;

            newState.startIndex = wordIndex;
            newState.highlightingMode = helper.startHighlightRequest(wordIndex, newState.selectedWords2);
            
            return newState;
        }

        case CONTINUE_RANGE_SELECTION: {
            const newState = {...state};
            const {wordIndex} = action;

            const newHighlightedElements = helper.updateHighlightRequest(wordIndex, state.selectedWords2, state.highlightingMode, state.startIndex);
            newState.selectedWords2 = newHighlightedElements;

            return newState;
        }

        case STOP_RANGE_SELECTION: {
            const newState = {...state};
            const {wordIndex} = action;

            const {mode, newHighlightedElements} = helper.stopHighlightRequest(wordIndex, state.selectedWords2, state.highlightingMode, state.startIndex);
            newState.highlightingMode = mode;
            newState.startIndex = NOT_SET_START_INDEX;
            newState.selectedWords2 = newHighlightedElements;

            return newState;
        }

        default:
            return state;
    }
};
