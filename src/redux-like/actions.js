import { WORD_CLICKED, SELECTION_CLICKED } from './actionTypes';

export const wordClicked = (wordIndex) => ({
    type: WORD_CLICKED,
    wordIndex
});

export const selectionClicked = (wordIndex) => ({
    type: SELECTION_CLICKED,
    wordIndex
});
