import * as React from 'react';
import { CanvasElement, ICanvasParams } from './CanvasElement';
import { INITIAL_CANVAS_HEIGHT, VIEW_PORT_SCALE } from './constants';
import { clearCanvas, renderWithChildren } from './utils/render';

export type RenderPlugin = (element: CanvasElement, canvasParams?: ICanvasParams) => void;

// tslint:disable-next-line:no-empty-interface
interface ICanvasContainerState {
    canvasWidth: number,
    canvasHeight: number
}

interface ICanvasContainerProps {
    mix?: string,
    onContextReady?: (canvasParams: ICanvasParams) => void,
    objectModel: CanvasElement[]
}

export class CanvasContainer extends React.Component<ICanvasContainerProps, ICanvasContainerState> {
    private canvas: HTMLCanvasElement | null;
    private ctx: CanvasRenderingContext2D | null;

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
            const { canvasHeight, canvasWidth } = this.state;
            
            
            if (this.props.onContextReady) {
                this.props.onContextReady({
                    ctx,
                    width: canvasWidth,
                    height: canvasHeight
                });
            }
            
            this.handleResize();

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
        const { canvasHeight, canvasWidth } = this.state;
        const { mix } = this.props;

        return (
            <canvas
                className={mix}
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
            canvasHeight: INITIAL_CANVAS_HEIGHT,
            canvasWidth:  window.innerWidth * VIEW_PORT_SCALE
        });
    }

    private prepareObjectModelAndRender() {
        const { ctx } = this;
        if (!ctx) { return; }

        const { objectModel } = this.props;
        const { canvasWidth, canvasHeight } = this.state;
        const canvasParams = {ctx, width: canvasWidth, height: canvasHeight};

        const elements = objectModel;
        this.renderOnCanvas(canvasParams, elements);
    }
    
    private renderOnCanvas(canvasParams: ICanvasParams, elements: CanvasElement[]) {
        clearCanvas(canvasParams);

        elements.forEach(element => {
            renderWithChildren(canvasParams, element);
        });
    }
}
