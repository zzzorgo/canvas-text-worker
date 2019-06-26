import { WORD_CLICKED, SELECTION_CLICKED } from './actionTypes';

const intialState = {
    selectedWords: [1, 2, 3],
    selectedWords2: [4,5,6]
};

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
    
        default:
            return state;
    }
};
