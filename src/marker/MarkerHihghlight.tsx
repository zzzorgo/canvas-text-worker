import * as _ from 'lodash';
import * as React from 'react';
import { CanvasContainer } from '../canvas/CanvasContainer';
import { CanvasElement, ICanvasParams, IPoint } from '../canvas/CanvasElement';
import { INITIAL_HIGHLIGHTED_CHARS, INITIAL_HIGHLIGHTED_WORDS, TEXT } from '../canvas/constants';
import { CharCanvasElement } from '../canvas/elements/CharCanvasElement';
import { TextCanvasElement } from '../canvas/elements/TextCanvasElement';
import { highlightPlugin } from '../canvas/plugins/highlight';
import { hoverPlugin } from '../canvas/plugins/hover';
import { setIsHitPlugin } from '../canvas/plugins/setIsHit';
import { getElementsFromText, toggleArrayElement } from '../canvas/utils/objectModel';
import { HighlightingMode, HighlightingState } from './HighlightingState';

export type RenderPlugin = (element: CanvasElement) => void;

interface IMarkerHighlightState {
    highlightedChars: number[],
    highlightedWords: number[],
    pointerPosition: IPoint,
    text: string
}

export class MarkerHighlight extends React.Component<{}, IMarkerHighlightState> {
    private hilightingState: HighlightingState = new HighlightingState();

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

    private updateHighlightedChars = (char: CharCanvasElement) => {
        const { highlightedChars } = this.state;

        const newHighlightedChars = this.hilightingState.getNewHighlightedChars(char.index, highlightedChars);
        this.setState({highlightedChars: newHighlightedChars});
    };

    /// Event handlers

    private getCharMouseDownHandler = (char: CharCanvasElement) => () => {
        const { highlightedChars } = this.state;
        const alreadyHighlighted = highlightedChars.includes(char.index);
        
        this.hilightingState.start = char.index;
        this.hilightingState.mode = alreadyHighlighted ? HighlightingMode.REMOVING : HighlightingMode.ADDING;
    }
    
    private getCharMouseMoveHandler = (char: CharCanvasElement) => () => {
        this.updateHighlightedChars(char);
    };
  
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