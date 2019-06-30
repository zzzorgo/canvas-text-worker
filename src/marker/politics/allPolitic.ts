import * as _ from 'lodash';
import { HighlightBrusheTypes } from 'src/canvas/plugins/brush';
import { HighlightingMode } from '.';

export class AllPolitic {
    public mode: HighlightingMode = HighlightingMode.STAND_BY;
    public start: number;

    public startHighlightRequest = (index: number, selectedElements: number[]) => {
        const alreadyHighlighted = selectedElements.includes(index);
        this.start = index;
        this.mode = alreadyHighlighted ? HighlightingMode.REMOVING : HighlightingMode.ADDING;

        return selectedElements;
    };

    public stopHighlightRequest = (index: number, selectedElements: number[]) => {
        const newHighlightedElements = this.updateHighlight(index, selectedElements);
        this.mode = HighlightingMode.STAND_BY;

        return newHighlightedElements;
    };

    public updateHighlightRequest = (highlightingEnd: number, highlightedElements: number[]) => {
        return this.updateHighlight(highlightingEnd, highlightedElements);
    };

    private updateHighlight = (highlightingEnd: number, highlightedElements: number[]) => {
        let newHighlightedElements: number[] = highlightedElements;
        const changedHighlightedElements = this.getChangedHighlightedElements(highlightingEnd);

        if (this.mode === HighlightingMode.REMOVING) {
            newHighlightedElements = _.without(highlightedElements, ...changedHighlightedElements);
        } else if (this.mode === HighlightingMode.ADDING) {
            newHighlightedElements = _.union(highlightedElements, changedHighlightedElements);
        }

        return newHighlightedElements;
    };

    private getChangedHighlightedElements = (end: number) => {
        const changedHighlightedElements = [];
        const { start } = this;

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
}

interface IHighlightItem {
    brushType: HighlightBrusheTypes,
    index: number
}
// tslint:disable-next-line:max-classes-per-file
export class HighligtingHelper {
    public mode: HighlightingMode = HighlightingMode.STAND_BY;
    public start: number;

    public startHighlightRequest = (index: number, selectedElements: number[]) => {
        const alreadyHighlighted = selectedElements.includes(index);
        const mode = alreadyHighlighted ? HighlightingMode.REMOVING : HighlightingMode.ADDING;

        return mode;
    };

    public stopHighlightRequest = (index: number, selectedElements: Map<number, IHighlightItem>, mode: HighlightingMode, start: number, currentBrush: HighlightBrusheTypes) => {
        const newHighlightedElements = this.updateHighlight(index, selectedElements, mode, start, currentBrush);

        return {newHighlightedElements};
    };

    public updateHighlightRequest = (highlightingEnd: number, highlightedElements:  Map<number, IHighlightItem>, mode: HighlightingMode, start: number, currentBrush: HighlightBrusheTypes) => {
        return this.updateHighlight(highlightingEnd, highlightedElements, mode, start, currentBrush);
    };

    private updateHighlight = (highlightingEnd: number, highlightedElements: Map<number, IHighlightItem>, mode: HighlightingMode, start: number, currentBrush: HighlightBrusheTypes) => {
        const newHighlightedElements = { ...highlightedElements };
        const changedIndexes = this.getChangedHighlightedElements(start, highlightingEnd);

        if (mode === HighlightingMode.ADDING) {
            for (const index of changedIndexes) {
                newHighlightedElements[index] = {index, brushType: currentBrush};
            }
        } else if (mode === HighlightingMode.REMOVING) {
            for (const index of changedIndexes) {
                delete newHighlightedElements[index];
            }
        }
    };

    private getChangedHighlightedElements = (end: number, start: number) => {
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
}
