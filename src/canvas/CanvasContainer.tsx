import * as React from 'react';
import { IPoint } from './CanvasElement';
import { getElementsFromText, setHitElements } from './dataUtils';
import { clearCanvas, renderWithChildren } from './renderUtils';

const INITIAL_CANVAS_WIDTH = 800;
const INITIAL_CANVAS_HEIGHT = 600;
const TEXT = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Ну и что-то на кириллице***`;

type MouseEvent = React.MouseEvent<HTMLElement>;

interface ICanvasContainerState {
    text: string,
    pointerPosition: IPoint,
    canvasWidth: number,
    canvasHeight: number
}

export class CanvasContainer extends React.Component<{}, ICanvasContainerState> {
    private canvas: HTMLCanvasElement | null;
    private ctx: CanvasRenderingContext2D | null;

    constructor(props: {}) {
        super(props);

        this.state = {
            canvasHeight: INITIAL_CANVAS_HEIGHT,
            canvasWidth: INITIAL_CANVAS_WIDTH,
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
            this.renderOnCanvas(this.ctx);
        }
    }
    
    public componentDidUpdate() {
        this.renderOnCanvas(this.ctx);
    }
    
    public render() {
        const { canvasWidth, canvasHeight } = this.state;
        return (
            <canvas
                onClick={this.handleCanvasClick}
                onMouseMove={this.handleCanvasMouseMove}
                width={canvasWidth}
                height={canvasHeight}
                ref={ref => this.canvas = ref} />
        );
    }

    private handleCanvasClick = (e: MouseEvent) => {
        // this.setState({canvasWidth: this.state.canvasWidth + 10});
    };

    private handleCanvasMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        this.setState({pointerPosition: {x: clientX, y: clientY}});
    };

    private renderOnCanvas(ctx: CanvasRenderingContext2D | null) {
        const { text, pointerPosition, canvasWidth, canvasHeight } = this.state;
        if (!ctx) { return; }
        const canvasParams = {ctx, width: canvasWidth, height: canvasHeight};

        clearCanvas(canvasParams);
        const elements = getElementsFromText(canvasParams, text);
        
        setHitElements(ctx, elements, pointerPosition);

        elements.forEach(element => {
            renderWithChildren(canvasParams, element);
        });
    }
}