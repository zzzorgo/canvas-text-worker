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

export class MyComponent extends React.Component<{}, IMyComponentState> {
    private shouldAddHighlightChars: boolean;
    private shouldRemoveHighlightChars: boolean;
    private highlightStart: number;
    private highlightEnd: number;

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

    private getCharMouseMoveHandler = (char: CharCanvasElement) => () => {
        this.lolo(char);
    };

    private lolo = (char: CharCanvasElement) => {
        const { highlightedChars } = this.state;

        this.highlightEnd = char.index;

        let leftIndex;
        let rightIndex;

        if (this.highlightStart < this.highlightEnd) {
            leftIndex = this.highlightStart;
            rightIndex = this.highlightEnd;
        } else {
            leftIndex = this.highlightEnd;
            rightIndex = this.highlightStart;
        }
        
        const changedHighlightedChars = [];

        for (let index = leftIndex; index <= rightIndex; index++) {
            changedHighlightedChars.push(index);
        }

        let newHighlightedChars: number[] = [];
        if (this.shouldRemoveHighlightChars) {
            newHighlightedChars = _.without(highlightedChars, ...changedHighlightedChars);
        } else if (this.shouldAddHighlightChars) {
            newHighlightedChars = _.union(highlightedChars, changedHighlightedChars);
        } else {
            return;
        }
        
        this.setState({highlightedChars: newHighlightedChars});
    }

    private getCharMouseDownHandler = (char: CharCanvasElement) => () => {
        const { highlightedChars } = this.state;
        const alreadyHighlighted = highlightedChars.includes(char.index);

        this.highlightStart = char.index;
        this.shouldAddHighlightChars = !alreadyHighlighted;
        this.shouldRemoveHighlightChars = alreadyHighlighted;
    }

    private getCharMouseUpHandler = (char: CharCanvasElement) => () => {       
        this.lolo(char);

        this.shouldAddHighlightChars = false;
        this.shouldRemoveHighlightChars = false;
    }

    private getWordContexMenuHandler = (word: TextCanvasElement) => () => {
        this.setState({
            highlightedWords: toggleArrayElement(this.state.highlightedWords, word.index)
        });
    }   
}