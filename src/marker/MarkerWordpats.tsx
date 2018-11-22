
import * as _ from 'lodash';
import * as React from 'react';

import { CharCanvasElement } from 'src/canvas/elements/CharCanvasElement';
import { CanvasContainer } from '../canvas/CanvasContainer';
import { ICanvasParams, IPoint } from '../canvas/CanvasElement';
import { TEXT } from '../canvas/constants';
import { TextCanvasElement } from '../canvas/elements/TextCanvasElement';
import { hoverPlugin } from '../canvas/plugins/hover';
import { setIsHitPlugin } from '../canvas/plugins/setIsHit';
import { getElementsFromText, getTextParams } from '../canvas/utils/objectModel';

interface IMarkerWordpartstState {
    currentMorpheme: MorphemeType,
    morphemeWords: MorphemeWords,
    pointerPosition: IPoint,
    text: string
}

enum MorphemeType {
    PREFIX,
    ROOT,
    SUFIX,
    ENDING
}

interface IMorphemeChar {
    lastMorphemeChar: boolean,
    morphemeType: MorphemeType
}

type MorphemeWord = Map<number, IMorphemeChar>;

type MorphemeWords = Map<number, MorphemeWord>;

export class MarkerWordparts extends React.Component<{}, IMarkerWordpartstState> {
    // private highlightingStart: number;
    private highlighting: boolean;

    constructor(props: {}) {
        super(props);

        this.state = {
            currentMorpheme: MorphemeType.PREFIX,
            morphemeWords: new Map(),
            pointerPosition: {x: -1, y: -1},
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
                    <button onClick={this.selectPrefixBrush}>1</button>
                </div>
            </div>
        );
    }

    private setPointerPosition = (pointerPosition: IPoint) => {
        this.setState({pointerPosition});
    }

    private charPlugin = (char: CharCanvasElement) => {
        const { pointerPosition } = this.state;

        setIsHitPlugin(char, pointerPosition);
        hoverPlugin(char);
    }

    private wordPlugin = (word: TextCanvasElement) => {
        const { pointerPosition } = this.state;

        setIsHitPlugin(word, pointerPosition);
        hoverPlugin(word, 'black', 0.1);
    }

    private prepareObjectModel = (canvasParams: ICanvasParams) => {
        const { text } = this.state;

        const textParams = getTextParams(text, 50, {x: 0, y: 0});
        const elements = getElementsFromText(canvasParams, textParams, this.wordPlugin, this.charPlugin);
        this.bindEventHandlers(elements);

        return elements;
    }

    private bindEventHandlers = (words: TextCanvasElement[]) => {
        words.forEach(word => {
            word.onMouseDown = this.getWordMouseDownHandler(word);
            word.onMouseMove = this.getWordMouseMoveHandler(word);
            word.onMouseUp = this.getWordMouseUpHandler(word);
        });
    }

    private updateWordMorphemes(word: TextCanvasElement) {
        if (!this.highlighting) {
            return;
        }
        const { morphemeWords, currentMorpheme } = this.state;
        const morphemeWord = morphemeWords.get(word.index) || new Map();
        const hitChar = word.children.find(char => char instanceof CharCanvasElement && char.getIsHit());

        if (hitChar instanceof CharCanvasElement) {
            const newMorphemeChar = {lastMorphemeChar: false, morphemeType: currentMorpheme};
            morphemeWord.set(hitChar.index, newMorphemeChar);
        }
    }

    /// Event handlers

    // Word
    private getWordMouseDownHandler = (word: TextCanvasElement) => () => {
        const hitChar = word.children.find(char => char instanceof CharCanvasElement && char.getIsHit());

        if (hitChar instanceof CharCanvasElement) {
            // this.highlightingStart = hitChar.index;
            this.highlighting = true;
        }
    }

    private getWordMouseMoveHandler = (word: TextCanvasElement) => () => {
        this.updateWordMorphemes(word);
    }

    private getWordMouseUpHandler = (word: TextCanvasElement) => () => {
        this.updateWordMorphemes(word);

        this.highlighting = false;
    }

    // Buttons
    private selectPrefixBrush = () => {
//
    };
}