import * as _ from 'lodash';

export enum HighlightingMode {
    STAND_BY = 'stand-by',
    ADDING = 'adding',
    REMOVING = 'removing'
}

export class HighlightingState {
    public mode: HighlightingMode = HighlightingMode.STAND_BY;
    public start: number;

    public getNewHighlightedElements = (highlightingEnd: number, highlightedElements: number[]) => {
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
