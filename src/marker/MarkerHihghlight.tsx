import * as _ from 'lodash';
import * as React from 'react';
import { underscoreBrushPlugin } from 'src/canvas/plugins/underscoreBrush';
import { unicodeBrushPlugin } from 'src/canvas/plugins/unicodeBrush';
import { CanvasContainer } from '../canvas/CanvasContainer';
import { CanvasElement, ICanvasParams, IPoint } from '../canvas/CanvasElement';
import { INITIAL_HIGHLIGHTED_WORDS, TEXT } from '../canvas/constants';
import { CharCanvasElement } from '../canvas/elements/CharCanvasElement';
import { TextCanvasElement } from '../canvas/elements/TextCanvasElement';
import { hoverPlugin } from '../canvas/plugins/hover';
import { setIsHitPlugin } from '../canvas/plugins/setIsHit';
import { simpleBrushPlugin } from '../canvas/plugins/simpleBrush';
import { getElementsFromText, getTextParams, toggleArrayElement } from '../canvas/utils/objectModel';
import { HighlightBrusheTypes } from './HighlightBrush';
import { HighlightingMode, HighlightingState } from './HighlightingState';

export type RenderPlugin = (element: CanvasElement) => void;

interface IBrushesState {
    [HighlightBrusheTypes.NONE]: number[],
    [HighlightBrusheTypes.SIMPLE]: number[],
    [HighlightBrusheTypes.UNICODE]: number[],
    [HighlightBrusheTypes.UNDERSCORE]: number[]
}

interface IMarkerHighlightState {
    brushes: IBrushesState,
    highlightedWords: number[],
    pointerPosition: IPoint,
    selectedBrush: HighlightBrusheTypes,
    text: string
}

export class MarkerHighlight extends React.Component<{}, IMarkerHighlightState> {
    private hilightingState: HighlightingState = new HighlightingState();

    constructor(props: {}) {
        super(props);

        this.state = {
            brushes: {
                [HighlightBrusheTypes.NONE]: [],
                [HighlightBrusheTypes.SIMPLE]: [],
                [HighlightBrusheTypes.UNICODE]: [],
                [HighlightBrusheTypes.UNDERSCORE]: []
            },
            highlightedWords: INITIAL_HIGHLIGHTED_WORDS,
            pointerPosition: {x: -1, y: -1},
            selectedBrush: HighlightBrusheTypes.NONE,
            text: TEXT
        }
    }

    public render() {
        return (
            <div>
                <CanvasContainer
                    prepareObjectModel={this.prepareObjectModel}
                    onMouseMove={this.setPointerPosition} />
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <button onClick={this.selectSimpleHighlight}>1</button>
                        <button onClick={this.selectUnicodeHighlight}>2</button>
                        <button onClick={this.selectUnderscoreHighlight}>3</button>
                    </div>
            </div>
        );
    }

    private setPointerPosition = (pointerPosition: IPoint) => {
        this.setState({pointerPosition});
    }

    private charPlugin = (char: CharCanvasElement, canvasParams: ICanvasParams) => {
        const { brushes, pointerPosition } = this.state;

        setIsHitPlugin(char, pointerPosition);
        hoverPlugin(char);
        simpleBrushPlugin(char, brushes[HighlightBrusheTypes.SIMPLE]);
        unicodeBrushPlugin(char, brushes[HighlightBrusheTypes.UNICODE], canvasParams);
        underscoreBrushPlugin(char, brushes[HighlightBrusheTypes.UNDERSCORE]);
    }

    private wordPlugin = (word: TextCanvasElement) => {
        const { highlightedWords, pointerPosition } = this.state;

        setIsHitPlugin(word, pointerPosition);
        simpleBrushPlugin(word, highlightedWords);
        hoverPlugin(word, 'black', 0.1);
    }

    private prepareObjectModel = (canvasParams: ICanvasParams) => {
        const { text } = this.state;

        const elements = getElementsFromText(canvasParams, getTextParams(text, 50, {x: 0, y: 0}), this.wordPlugin, this.charPlugin);
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
        const { brushes, selectedBrush } = this.state;

        const newHighlightedChars = this.hilightingState.getNewHighlightedChars(char.index, brushes[selectedBrush]);
        const newBrushes = {
            ...brushes,
            [selectedBrush]: newHighlightedChars
        };

        this.setState({brushes: newBrushes});
    };

    /// Event handlers

    private getCharMouseDownHandler = (char: CharCanvasElement) => () => {
        const { brushes, selectedBrush } = this.state;
        const alreadyHighlighted = brushes[selectedBrush].includes(char.index);
        
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

    private selectSimpleHighlight = () => {
        this.setState({selectedBrush: HighlightBrusheTypes.SIMPLE});
    };

    private selectUnicodeHighlight = () => {
        this.setState({selectedBrush: HighlightBrusheTypes.UNICODE});
    };

    private selectUnderscoreHighlight = () => {
        this.setState({selectedBrush: HighlightBrusheTypes.UNDERSCORE});
    };
}