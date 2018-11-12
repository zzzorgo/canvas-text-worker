import * as React from 'react';
import { CanvasElement, ICanvasParams, IPoint } from './CanvasElement';
import { INITIAL_CANVAS_HEIGHT, MouseEvent, VIEW_PORT_SCALE } from './constants';
import { handleElementClickEvents, setHitElements } from './utils/objectModel';
import { clearCanvas, renderWithChildren } from './utils/render';

export type RenderPlugin = (element: CanvasElement) => void;

interface ICanvasContainerState {
    canvasHeight: number,
    canvasWidth: number,
    pointerPosition: IPoint
}

interface ICanvasContainerProps {
    prepareObjectModel: (canvasParams: ICanvasParams) => CanvasElement[]
}

export class CanvasContainer extends React.Component<ICanvasContainerProps, ICanvasContainerState> {
    private canvas: HTMLCanvasElement | null;
    private ctx: CanvasRenderingContext2D | null;
    private elements: CanvasElement[];

    constructor(props: ICanvasContainerProps) {
        super(props);

        this.state = {
            canvasHeight: INITIAL_CANVAS_HEIGHT,
            canvasWidth: window.innerWidth * VIEW_PORT_SCALE,
            pointerPosition: {
                x: 0,
                y: 0
            }
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
        const start = new Date().getMilliseconds(); 
        this.prepareObjectModelAndRender();
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

    private prepareObjectModelAndRender() {
        const { ctx } = this;
        if (!ctx) { return; }

        const { prepareObjectModel } = this.props;
        const { pointerPosition, canvasWidth, canvasHeight } = this.state;
        const canvasParams = {ctx, width: canvasWidth, height: canvasHeight};

        const elements = prepareObjectModel(canvasParams);
        this.elements = elements;
        setHitElements(ctx, elements, pointerPosition);
        this.renderOnCanvas(canvasParams, elements);
    }
    
    private renderOnCanvas(canvasParams: ICanvasParams, elements: CanvasElement[]) {
        clearCanvas(canvasParams);

        elements.forEach(element => {
            renderWithChildren(canvasParams, element);
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