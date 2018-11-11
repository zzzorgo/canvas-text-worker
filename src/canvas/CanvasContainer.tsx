import * as React from 'react';
import { CanvasElement, IPoint } from './CanvasElement';
import { CharCanvasElement } from './CharCanvasElement';
import { INITIAL_CANVAS_HEIGHT, INITIAL_CANVAS_WIDTH, INITIAL_HIGHLIGHTED_CHARS, MouseEvent, TEXT, VIEW_PORT_SCALE } from './constants';
import { HighlightCharCanvasElement } from './HighlightCharCanvasElement';
import { getElementsFromText, handleElementClick, setHitElements, toggleArrayElement } from './utils/data';
import { clearCanvas, renderWithChildren } from './utils/render';

export type CharCanvasPlugin = (char: CharCanvasElement) => void;

interface ICanvasContainerState {
    canvasHeight: number,
    canvasWidth: number,
    highlightedChars: number[],
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
            canvasWidth: INITIAL_CANVAS_WIDTH,
            highlightedChars: INITIAL_HIGHLIGHTED_CHARS,
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
    }

    
    public componentDidUpdate() {      
        this.prepareDataAndRender();
    }
    
    public render() {
        const { canvasWidth, canvasHeight } = this.state;
        return (
            <canvas
                onClick={this.handleCanvasClick}
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
    
    private highlightPlugin = (char: CharCanvasElement) => {
        const { highlightedChars } = this.state;

        if (highlightedChars.includes(char.index)) {
            const highlight = new HighlightCharCanvasElement();
            highlight.rect = char.rect;

            char.children.push(highlight);
        }
    };

    private prepareDataAndRender() {
        const { ctx } = this;
        if (!ctx) { return; }
        const { text, pointerPosition, canvasWidth, canvasHeight } = this.state;
        const canvasParams = {ctx, width: canvasWidth, height: canvasHeight};

        this.elements = getElementsFromText(canvasParams, text, [this.highlightPlugin]);

        this.elements.forEach(word => word.children.forEach(char => {
            if (char instanceof CharCanvasElement) {
                char.onClick = (e: MouseEvent) => {
                    this.setState({
                        highlightedChars: toggleArrayElement(this.state.highlightedChars, char.index)
                    });
                }
            }
        }));

        setHitElements(ctx, this.elements, pointerPosition);
        this.renderOnCanvas(ctx, this.elements);
    }

    private handleCanvasClick = (e: MouseEvent) => {
        handleElementClick(this.elements, e);
    };

    private handleCanvasMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        this.setState({pointerPosition: {x: clientX, y: clientY}});
    };

    private renderOnCanvas(ctx: CanvasRenderingContext2D | null, elements: CanvasElement[]) {
        if (!ctx) { return; }

        const { canvasWidth, canvasHeight } = this.state;
        const canvasParams = {ctx, width: canvasWidth, height: canvasHeight};

        clearCanvas(canvasParams);

        elements.forEach(element => {
            renderWithChildren(canvasParams, element);
        });
    }
}