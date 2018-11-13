import * as React from 'react';
import { CanvasElement, ICanvasParams, IPoint } from './CanvasElement';
import { INITIAL_CANVAS_HEIGHT, MouseEvent, VIEW_PORT_SCALE } from './constants';
import { handleElementMouseEvents } from './utils/objectModel';
import { clearCanvas, renderWithChildren } from './utils/render';

export type RenderPlugin = (element: CanvasElement) => void;

interface ICanvasContainerState {
    canvasHeight: number,
    canvasWidth: number
}

interface ICanvasContainerProps {
    prepareObjectModel: (canvasParams: ICanvasParams) => CanvasElement[],
    onMouseMove: (pointerPosition: IPoint) => void
}

export class CanvasContainer extends React.Component<ICanvasContainerProps, ICanvasContainerState> {
    private canvas: HTMLCanvasElement | null;
    private ctx: CanvasRenderingContext2D | null;
    private elements: CanvasElement[];

    constructor(props: ICanvasContainerProps) {
        super(props);

        this.state = {
            canvasHeight: INITIAL_CANVAS_HEIGHT,
            canvasWidth: window.innerWidth * VIEW_PORT_SCALE
        }
    }
    
    public componentDidMount() {
        if (this.canvas) {
            const ctx = this.canvas.getContext('2d');
            if (!ctx) { return; }
            this.ctx = ctx;
            
            this.prepareObjectModelAndRender();
        }

        window.addEventListener('resize', this.handleResize);
    }

    public componentDidUpdate() {     
        this.prepareObjectModelAndRender();
    }

    public componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }
    
    public render() {
        const { canvasWidth, canvasHeight } = this.state;

        return (
            <canvas
                onMouseDown={this.handleCanvasMouseDown}
                onMouseUp={this.handleCanvasMouseUp}
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

    private prepareObjectModelAndRender() {
        const { ctx } = this;
        if (!ctx) { return; }

        const { prepareObjectModel } = this.props;
        const { canvasWidth, canvasHeight } = this.state;
        const canvasParams = {ctx, width: canvasWidth, height: canvasHeight};

        const elements = prepareObjectModel(canvasParams);
        this.elements = elements;
        this.renderOnCanvas(canvasParams, elements);
    }
    
    private renderOnCanvas(canvasParams: ICanvasParams, elements: CanvasElement[]) {
        clearCanvas(canvasParams);

        elements.forEach(element => {
            renderWithChildren(canvasParams, element);
        });
    }

    private handleCanvasClick = (e: MouseEvent) => {
        handleElementMouseEvents('onClick', this.elements, e);
    };

    private handleCanvasMouseDown = (e: MouseEvent) => {
        handleElementMouseEvents('onMouseDown', this.elements, e);
    };

    private handleCanvasMouseUp = (e: MouseEvent) => {
        handleElementMouseEvents('onMouseUp', this.elements, e);
    };

    private handleCanvasContextMenu = (e: MouseEvent) => {
        e.preventDefault();
        handleElementMouseEvents('onContextMenu', this.elements, e);
    };

    private handleCanvasMouseMove = (e: MouseEvent) => {
        const { onMouseMove } = this.props;
        const pointerPosition = {x: e.clientX, y: e.clientY};
        onMouseMove(pointerPosition);
        handleElementMouseEvents('onMouseMove', this.elements, e);
    };
}
