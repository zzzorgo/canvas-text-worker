/* tslint:disable */
import * as _ from 'lodash';
import * as React from 'react';

import { CanvasContainer } from '../../canvas/CanvasContainer';
import { CanvasElement, ICanvasParams, IPoint } from '../../canvas/CanvasElement';
import { MouseEvent, TEXT } from '../../canvas/constants';
import { CharCanvasElement } from '../../canvas/elements/CharCanvasElement';
import { TextCanvasElement } from '../../canvas/elements/TextCanvasElement';
import {
    HighlightBrusheTypes,
    simpleBrushPlugin,
    underscoreBrushPlugin,
    unicodeBrushPlugin 
} from '../../canvas/plugins/brush';
import { hoverPlugin } from '../../canvas/plugins/hover';
import { setIsHitPlugin } from '../../canvas/plugins/setIsHit';
import { getElementsFromText, getTextParams, toggleArrayElement } from '../../canvas/utils/objectModel';

import { HighlightingMode, HighlightingState } from '../HighlightingState';

import './MarkerHihghlight_LAYERS.css';

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
    private mainTextElements: TextCanvasElement[];

    constructor(props: {}) {
        super(props);

        this.state = {
            brushes: {
                [HighlightBrusheTypes.NONE]: [],
                [HighlightBrusheTypes.SIMPLE]: [],
                [HighlightBrusheTypes.UNICODE]: [],
                [HighlightBrusheTypes.UNDERSCORE]: []
            },
            highlightedWords: [],
            pointerPosition: {x: -1, y: -1},
            selectedBrush: HighlightBrusheTypes.SIMPLE,
            text: TEXT
        }
    }

    public render() {
        return (
            <div>
                    <div>
                        <button onClick={this.selectSimpleHighlight}>1</button>
                        <button onClick={this.selectUnicodeHighlight}>2</button>
                        <button onClick={this.selectUnderscoreHighlight}>3</button>
                    </div>
                <div>
                    {/* <CanvasContainer
                        mix="canvas-container-layer"
                        prepareObjectModel={this.prepareObjectModel1} /> */}
                    <CanvasContainer
                        mix="canvas-container-layer"
                        prepareObjectModel={this.prepareObjectModel2} />
                    <HoverLayer />
                </div>
            </div>
        );
    }

    // private setPointerPosition = (pointerPosition: IPoint) => {
    //     this.setState({pointerPosition});
    // }

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
        hoverPlugin(word, 'black', 0.1);
        simpleBrushPlugin(word, highlightedWords);
    }

    // private prepareObjectModel1 = (canvasParams: ICanvasParams) => {
    //     const { text } = this.state;

    //     const textParams = getTextParams(text, 50, {x: 0, y: 0});
    //     const elements = getElementsFromText(canvasParams, textParams, this.wordPlugin, this.charPlugin);

    //     return elements;
    // }    
    
    private prepareObjectModel2 = (canvasParams: ICanvasParams) => {
        const { text } = this.state;

        console.log(this.wordPlugin, this.charPlugin);
        console.log(this.bindEventHandlers);
        const textParams = getTextParams(text, 50, {x: 0, y: 0});
        this.mainTextElements = getElementsFromText(canvasParams, textParams);;

        return this.mainTextElements;
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

    private getWordContexMenuHandler = (word: TextCanvasElement) => (e: MouseEvent) => {
        e.preventDefault();
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

class HoverLayer extends React.Component {
    state = {};

    public render() {
        return (
            <CanvasContainer
                mix="canvas-container-layer"
                prepareObjectModel={this.prepareObjectModel}
                onMouseMove={this.setPointerPosition} />
        );
    }

    prepareObjectModel = () => {
        return [];
    };

    private setPointerPosition = (pointerPosition: IPoint) => {
        this.setState({pointerPosition});
    }
}
