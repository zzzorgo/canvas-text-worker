import * as React from 'react';
import { CanvasElement, ICanvasParams } from './CanvasElement';
import { VIEW_PORT_SCALE } from './constants';
import { clearCanvas, renderWithChildren } from './utils/render';

export type RenderPlugin = (element: CanvasElement, canvasParams?: ICanvasParams) => void;

// tslint:disable-next-line:no-empty-interface
interface ICanvasContainerState {
    canvasWidth: number
}

interface ICanvasContainerProps {
    mix?: string,
    onContextReady?: (canvasWidth: number, canvasHeight: number, ctx?: CanvasRenderingContext2D) => void,
    objectModel: CanvasElement[],
    height: number
}

export class CanvasContainer extends React.Component<ICanvasContainerProps, ICanvasContainerState> {
    private canvas: HTMLCanvasElement | null;
    private ctx: CanvasRenderingContext2D | null;

    constructor(props: ICanvasContainerProps) {
        super(props);

        this.state = {
            canvasWidth: window.innerWidth * VIEW_PORT_SCALE
        }
    }
    
    public componentDidMount() {
        if (this.canvas) {
            const ctx = this.canvas.getContext('2d');
            if (!ctx) { return; }
            this.ctx = ctx;
            const { canvasWidth } = this.state;
            const { height: canvasHeight } = this.props;
            
            
            if (this.props.onContextReady) {
                this.props.onContextReady(canvasWidth, canvasHeight, ctx);
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
        const { canvasWidth } = this.state;
        const { mix, height: canvasHeight } = this.props;

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
        const canvasWidth = window.innerWidth * VIEW_PORT_SCALE;
        const { height: canvasHeight } = this.props;

        this.setState({
            canvasWidth
        });

        if (this.props.onContextReady) {
            this.props.onContextReady(canvasWidth, canvasHeight);
        }
    }

    private prepareObjectModelAndRender() {
        const { ctx } = this;
        if (!ctx) { return; }
        
        // разобраться почему буквы скачут если положить строчку прямо перед отрисовкой текста
        ctx.textBaseline = 'bottom';

        const { objectModel, height } = this.props;
        const { canvasWidth } = this.state;
        const canvasParams = {ctx, width: canvasWidth, height};

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
