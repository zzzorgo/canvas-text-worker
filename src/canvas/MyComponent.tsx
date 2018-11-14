import * as _ from 'lodash';
import * as React from 'react';
import { CanvasContainer } from './CanvasContainer';
import { CanvasElement, ICanvasParams, IPoint } from './CanvasElement';
import { INITIAL_HIGHLIGHTED_CHARS, INITIAL_HIGHLIGHTED_WORDS, TEXT } from './constants';
import { CharCanvasElement } from './elements/CharCanvasElement';
import { TextCanvasElement } from './elements/TextCanvasElement';
import { highlightPlugin } from './plugins/highlight';
import { hoverPlugin } from './plugins/hover';
import { setIsHitPlugin } from './plugins/setIsHit';
import { getElementsFromText, toggleArrayElement } from './utils/objectModel';

export type RenderPlugin = (element: CanvasElement) => void;

interface IMyComponentState {
    highlightedChars: number[],
    highlightedWords: number[],
    pointerPosition: IPoint,
    text: string
}

enum HighlightingMode {
    STAND_BY,
    ADDING,
    REMOVING
}

interface IHighlightingState {
    end: number;
    mode: HighlightingMode;
    start: number;
}

export class MyComponent extends React.Component<{}, IMyComponentState> {
    private hilightingState: IHighlightingState = {
        end: -1,
        mode: HighlightingMode.STAND_BY,
        start: -1
    };

    constructor(props: {}) {
        super(props);

        this.state = {
            highlightedChars: INITIAL_HIGHLIGHTED_CHARS,
            highlightedWords: INITIAL_HIGHLIGHTED_WORDS,
            pointerPosition: {x: -1, y: -1},
            text: TEXT
        }
    }

    public render() {
        return <CanvasContainer
            prepareObjectModel={this.prepareObjectModel}
            onMouseMove={this.setPointerPosition} />
    }

    private setPointerPosition = (pointerPosition: IPoint) => {
        this.setState({pointerPosition});
    }

    private charPlugin = (char: CharCanvasElement) => {
        const { highlightedChars, pointerPosition } = this.state;

        setIsHitPlugin(char, pointerPosition);
        highlightPlugin(char, highlightedChars);
        hoverPlugin(char);
    }

    private wordPlugin = (word: TextCanvasElement) => {
        const { highlightedWords, pointerPosition } = this.state;

        setIsHitPlugin(word, pointerPosition);
        highlightPlugin(word, highlightedWords);
        hoverPlugin(word, 'black', 0.1);
    }

    private prepareObjectModel = (canvasParams: ICanvasParams) => {
        const { text } = this.state;

        const elements = getElementsFromText(canvasParams, text, this.wordPlugin, this.charPlugin);
        this.bindEventHandlers(elements);

        return elements;
    }

    private bindEventHandlers = (elements: CanvasElement[]) => {
        elements.forEach(word => {
            if (word instanceof TextCanvasElement) {
                word.onContextMenu = this.getWordContexMenuHandler(word);
            }

            word.children.forEach(char => {
                if (char instanceof CharCanvasElement) {
                    char.onMouseDown = this.getCharMouseDownHandler(char);
                    char.onMouseMove = this.getCharMouseMoveHandler(char);
                    char.onMouseUp = this.getCharMouseUpHandler(char);
                }
            }
        )});
    }


    private getChangedHighlightedChars = (char: CharCanvasElement) => {
        const changedHighlightedChars = [];
        this.hilightingState.end = char.index;
        const { start, end } = this.hilightingState;

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

    private getNewHighlightedChars = (char: CharCanvasElement) => {
        const { highlightedChars } = this.state;
        let newHighlightedChars: number[] = highlightedChars;
        const changedHighlightedChars = this.getChangedHighlightedChars(char);

        if (this.hilightingState.mode === HighlightingMode.REMOVING) {
            newHighlightedChars = _.without(highlightedChars, ...changedHighlightedChars);
        } else if (this.hilightingState.mode === HighlightingMode.ADDING) {
            newHighlightedChars = _.union(highlightedChars, changedHighlightedChars);
        }

        return newHighlightedChars;
    };

    private updateHighlightedChars = (char: CharCanvasElement) => {
        const newHighlightedChars = this.getNewHighlightedChars(char);
        this.setState({highlightedChars: newHighlightedChars});
    };

    /// Event handlers

    private getCharMouseMoveHandler = (char: CharCanvasElement) => () => {
        this.updateHighlightedChars(char);
    };

    private getCharMouseDownHandler = (char: CharCanvasElement) => () => {
        const { highlightedChars } = this.state;
        const alreadyHighlighted = highlightedChars.includes(char.index);

        this.hilightingState.start = char.index;
        this.hilightingState.mode = alreadyHighlighted ? HighlightingMode.REMOVING : HighlightingMode.ADDING;
    }

    private getCharMouseUpHandler = (char: CharCanvasElement) => () => {
        this.updateHighlightedChars(char);

        this.hilightingState.mode = HighlightingMode.STAND_BY;
    }

    private getWordContexMenuHandler = (word: TextCanvasElement) => () => {
        this.setState({
            highlightedWords: toggleArrayElement(this.state.highlightedWords, word.index)
        });
    }
}