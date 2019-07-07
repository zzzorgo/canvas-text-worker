// tslint:disable
import * as constants from './actionTypes';

export const selectionClicked = (wordIndex) => ({
    type: constants.SELECTION_CLICKED,
    wordIndex
});

export const startRangeSelection = (wordIndex) => ({
    type: constants.START_RANGE_SELECTION,
    wordIndex
});

export const stopRangeSelection = (wordIndex) => ({
    type: constants.STOP_RANGE_SELECTION,
    wordIndex
});

export const continueRangeSelection = (element) => ({
    type: constants.CONTINUE_RANGE_SELECTION,
    element
});

export const setCurrentBrush = (brushType) => ({
    type: constants.SET_CURRENT_BRUSH,
    brushType
});

export const removeHoveredElement = () => ({
    type: constants.REMOVE_HOVERED_ELEMENT
});

export const setHoveredElement = (element) => ({
    type: constants.SET_HOVERED_ELEMENT,
    element
});
