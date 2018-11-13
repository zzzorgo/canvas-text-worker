import * as React from 'react';
import { CanvasContainer } from './CanvasContainer';
import { CanvasElement, ICanvasParams, IIndexedCanvasElement, IPoint } from './CanvasElement';
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

    private charPlugin = (char: IIndexedCanvasElement) => {
        const { highlightedChars, pointerPosition } = this.state;

        setIsHitPlugin(char, pointerPosition);
        highlightPlugin(char, highlightedChars);
        hoverPlugin(char);
    }
    
    private wordPlugin = (word: IIndexedCanvasElement) => {
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
                    char.onMouseMove = this.getCharMoveHandler(char);
                    char.onMouseUp = this.getCharMouseUpHandler(char);
                }
            }
        )});
    }

    private getCharMoveHandler = (char: CharCanvasElement) => () => {
        if (char.getIsHit()) {
            this.toggleHighlightedChar(char);
        }
    }

    private getCharMouseDownHandler = (char: CharCanvasElement) => () => {
        const { highlightedChars } = this.state;
        const alreadyHighlighted = highlightedChars.includes(char.index);

        this.shouldAddHighlightChars = !alreadyHighlighted;
        this.shouldRemoveHighlightChars = alreadyHighlighted;
    }

    private getCharMouseUpHandler = (char: CharCanvasElement) => () => {       
        this.toggleHighlightedChar(char);
        this.shouldAddHighlightChars = false;
        this.shouldRemoveHighlightChars = false;
    }

    private toggleHighlightedChar(char: CharCanvasElement) {
        const { highlightedChars } = this.state;

        if (this.shouldAddHighlightChars) {
            this.setState({
                highlightedChars: [...highlightedChars, char.index]
            });
        } else if (this.shouldRemoveHighlightChars) {
            this.setState({
                highlightedChars: highlightedChars.filter(charIndex => charIndex !== char.index)
            });
        }
    }

    private getWordContexMenuHandler = (word: TextCanvasElement) => () => {
        this.setState({
            highlightedWords: toggleArrayElement(this.state.highlightedWords, word.index)
        });
    }
}