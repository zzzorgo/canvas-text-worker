import { WORD_CLICKED, SELECTION_CLICKED, LEAVE_WORD, ENTER_WORD, START_RANGE_SELECTION, STOP_RANGE_SELECTION, CONTINUE_RANGE_SELECTION } from './actionTypes';

export const selectionClicked = (wordIndex) => ({
    type: SELECTION_CLICKED,
    wordIndex
});

export const startRangeSelection = (wordIndex) => ({
    type: START_RANGE_SELECTION,
    wordIndex
});

export const stopRangeSelection = (wordIndex) => ({
    type: STOP_RANGE_SELECTION,
    wordIndex
});

export const continueRangeSelection = (wordIndex) => ({
    type: CONTINUE_RANGE_SELECTION,
    wordIndex
});

