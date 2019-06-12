import * as _ from 'lodash';
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
