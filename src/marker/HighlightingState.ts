import * as _ from 'lodash';

export enum HighlightingMode {
    STAND_BY,
    ADDING,
    REMOVING
}

export class HighlightingState {
    public mode: HighlightingMode = HighlightingMode.STAND_BY;
    public start: number;

    public getNewHighlightedChars = (highlightingEnd: number, highlightedChars: number[]) => {
        let newHighlightedChars: number[] = highlightedChars;
        const changedHighlightedChars = this.getChangedHighlightedChars(highlightingEnd);

        if (this.mode === HighlightingMode.REMOVING) {
            newHighlightedChars = _.without(highlightedChars, ...changedHighlightedChars);
        } else if (this.mode === HighlightingMode.ADDING) {
            newHighlightedChars = _.union(highlightedChars, changedHighlightedChars);
        }

        return newHighlightedChars;
    };

    private getChangedHighlightedChars = (end: number) => {
        const changedHighlightedChars = [];
        const { start } = this;

        if (start < end) {
            for (let index = start; index <= end; index++) {
                changedHighlightedChars.push(index);
            }
        } else {
            for (let index = start; index >= end; index--) {
                changedHighlightedChars.push(index);
            }
        }

        return changedHighlightedChars;
    };
}
