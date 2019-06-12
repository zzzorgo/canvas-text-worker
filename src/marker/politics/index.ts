import { AllPolitic } from './allPolitic';
import { OneOfPolitic } from './oneOfPolitics';

export enum HighlightingMode {
    STAND_BY = 'stand-by',
    ADDING = 'adding',
    REMOVING = 'removing'
}

export enum HighlightPoltic {
    ONE_OF,
    ALL
} 

const politicsMap = {
    [HighlightPoltic.ONE_OF]: OneOfPolitic,
    [HighlightPoltic.ALL]: AllPolitic
};

export const getHighlightingPolitic = (politic: HighlightPoltic) => {
    return new politicsMap[politic]();
};
