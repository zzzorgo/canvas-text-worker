import * as React from 'react';
import { CanvasContainer } from './CanvasContainer';
import { CanvasElement, ICanvasParams, IIndexedCanvasElement } from './CanvasElement';
import { INITIAL_HIGHLIGHTED_CHARS, INITIAL_HIGHLIGHTED_WORDS, TEXT } from './constants';
import { CharCanvasElement } from './elements/CharCanvasElement';
import { TextCanvasElement } from './elements/TextCanvasElement';
import { highlightPlugin } from './plugins/highlight';
import { getElementsFromText, toggleArrayElement } from './utils/objectModel';

export type RenderPlugin = (element: CanvasElement) => void;

interface IMyComponentState {
    highlightedChars: number[],
    highlightedWords: number[],
    text: string
}

export class MyComponent extends React.Component<{}, IMyComponentState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            highlightedChars: INITIAL_HIGHLIGHTED_CHARS,
            highlightedWords: INITIAL_HIGHLIGHTED_WORDS,
            text: TEXT
        }
    }  

    public render() {
        return <CanvasContainer prepareObjectModel={this.prepareObjectModel} />
    }

    private charHighlightPlugin = (char: IIndexedCanvasElement) => {
        const { highlightedChars } = this.state;

        highlightPlugin(highlightedChars, char);
    }
    
    private wordHighlightPlugin = (word: IIndexedCanvasElement) => {
        const { highlightedWords } = this.state;

        highlightPlugin(highlightedWords, word);
    }

    private prepareObjectModel = (canvasParams: ICanvasParams) => {
        const { text } = this.state;
        
        const elements = getElementsFromText(canvasParams, text, [this.wordHighlightPlugin], [this.charHighlightPlugin]);
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
                    char.onClick = this.getCharClickHandler(char);
                }
            }
        )});
    }

    private getCharClickHandler = (char: CharCanvasElement) => () => {
        this.setState({
            highlightedChars: toggleArrayElement(this.state.highlightedChars, char.index)
        });
    }

    private getWordContexMenuHandler = (word: TextCanvasElement) => () => {
        this.setState({
            highlightedWords: toggleArrayElement(this.state.highlightedWords, word.index)
        });
    }
}