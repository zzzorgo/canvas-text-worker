import * as React from 'react';
import { CanvasElement, IIndexedCanvasElement, IPoint } from './CanvasElement';
import { CharCanvasElement } from './CharCanvasElement';
import { INITIAL_CANVAS_HEIGHT, INITIAL_HIGHLIGHTED_CHARS, INITIAL_HIGHLIGHTED_WORDS, MouseEvent, TEXT, VIEW_PORT_SCALE } from './constants';
import { highlightPlugin } from './plugins/highlight';
import { TextCanvasElement } from './TextCanvasElement';
import { getElementsFromText, handleElementClickEvents, setHitElements, toggleArrayElement } from './utils/data';
import { clearCanvas, renderWithChildren } from './utils/render';

export type RenderPlugin = (element: CanvasElement) => void;

interface ICanvasContainerState {
    canvasHeight: number,
    canvasWidth: number,
    highlightedChars: number[],
    highlightedWords: number[],
    pointerPosition: IPoint,
    text: string
}

export class CanvasContainer extends React.Component<{}, ICanvasContainerState> {
    private canvas: HTMLCanvasElement | null;
    private ctx: CanvasRenderingContext2D | null;
    private elements: CanvasElement[];

    constructor(props: {}) {
        super(props);

        this.state = {
            canvasHeight: INITIAL_CANVAS_HEIGHT,
            canvasWidth: window.innerWidth * VIEW_PORT_SCALE,
            highlightedChars: INITIAL_HIGHLIGHTED_CHARS,
            highlightedWords: INITIAL_HIGHLIGHTED_WORDS,
            pointerPosition: {
                x: 0,
                y: 0
            },
            text: TEXT
        }
    }
    
    public componentDidMount() {
        if (this.canvas) {
            this.ctx = this.canvas.getContext('2d');

            this.prepareDataAndRender();
        }

        window.addEventListener('resize', this.handleResize);
    }

    public componentDidUpdate() {     
        const start = new Date().getMilliseconds(); 
        this.prepareDataAndRender();
        const end = new Date().getMilliseconds();
        // tslint:disable-next-line:no-console
        console.log((end - start) + ' ms');
    }

    public componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }
    
    public render() {
        const { canvasWidth, canvasHeight } = this.state;

        return (
            <canvas
                onClick={this.handleCanvasClick}
                onContextMenu={this.handleCanvasContextMenu}
                onMouseMove={this.handleCanvasMouseMove}
                width={canvasWidth}
                height={canvasHeight}
                ref={ref => this.canvas = ref} 
                style={{
                    height: canvasHeight / VIEW_PORT_SCALE,
                    width: canvasWidth / VIEW_PORT_SCALE
                }} />
        );
    }   

    private handleResize = () => {
        this.setState({
            canvasWidth: window.innerWidth * VIEW_PORT_SCALE
        });
    }

    private charHighlightPlugin = (char: IIndexedCanvasElement) => {
        const { highlightedChars } = this.state;

        highlightPlugin(highlightedChars, char);
    }
    
    private wordHighlightPlugin = (word: IIndexedCanvasElement) => {
        const { highlightedWords } = this.state;

        highlightPlugin(highlightedWords, word);
    }

    private prepareDataAndRender() {
        const { ctx } = this;
        if (!ctx) { return; }
        const { text, pointerPosition, canvasWidth, canvasHeight } = this.state;
        const canvasParams = {ctx, width: canvasWidth, height: canvasHeight};
        
        this.elements = getElementsFromText(canvasParams, text, [this.wordHighlightPlugin], [this.charHighlightPlugin]);
        this.bindEventHandlers(this.elements);
        setHitElements(ctx, this.elements, pointerPosition);
        
        this.renderOnCanvas(ctx, this.elements);
    }
    
    private renderOnCanvas(ctx: CanvasRenderingContext2D | null, elements: CanvasElement[]) {
        if (!ctx) { return; }

        const { canvasWidth, canvasHeight } = this.state;
        const canvasParams = {ctx, width: canvasWidth, height: canvasHeight};

        clearCanvas(canvasParams);

        elements.forEach(element => {
            renderWithChildren(canvasParams, element);
        });
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

    private handleCanvasClick = (e: MouseEvent) => {
        handleElementClickEvents('onClick', this.elements, e);
    };

    private handleCanvasContextMenu = (e: MouseEvent) => {
        e.preventDefault();
        handleElementClickEvents('onContextMenu', this.elements, e);
    };

    private handleCanvasMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        this.setState({pointerPosition: {x: clientX, y: clientY}});
    };
}