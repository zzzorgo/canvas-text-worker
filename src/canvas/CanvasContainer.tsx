import * as React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { IState } from 'src';
import { setCanvasParamsSize } from '../marker/actions';
import { getCanvasSize } from '../marker/selectors';
import { CanvasElement, ICanvasParams, IPoint, ISize } from './CanvasElement';
import { INITIAL_CANVAS_HEIGHT, MouseEvent, VIEW_PORT_SCALE } from './constants';
import { handleElementMouseEvents } from './utils/objectModel';
import { clearCanvas, renderWithChildren } from './utils/render';

export type RenderPlugin = (element: CanvasElement, canvasParams?: ICanvasParams) => void;

// tslint:disable-next-line:no-empty-interface
interface ICanvasContainerState {

}

interface ICanvasContainerProps {
    onMouseMove?: (pointerPosition: IPoint) => void,
    mix?: string,
    setCanvasParamsSize: (size: ISize) => void,
    canvasSize: ISize,
    onContextReady?: (ctx: CanvasRenderingContext2D) => void,
    objectModel: CanvasElement[]
}

class CanvasContainerComponent extends React.Component<ICanvasContainerProps, ICanvasContainerState> {
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

            if (this.props.onContextReady) {
                this.props.onContextReady(ctx);
            }
            
            this.props.setCanvasParamsSize({
                height: INITIAL_CANVAS_HEIGHT,
                width: window.innerWidth * VIEW_PORT_SCALE
            });
            
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
        const { canvasSize } = this.props;
        const { mix } = this.props;

        return (
            <canvas
                className={mix}
                onMouseDown={this.handleCanvasMouseDown}
                onMouseUp={this.handleCanvasMouseUp}
                onClick={this.handleCanvasClick}
                onContextMenu={this.handleCanvasContextMenu}
                onMouseMove={this.handleCanvasMouseMove}
                width={canvasSize.width}
                height={canvasSize.height}
                ref={ref => this.canvas = ref} 
                style={{
                    height: canvasSize.height / VIEW_PORT_SCALE,
                    width: canvasSize.width / VIEW_PORT_SCALE
                }} />
        );
    }   

    private handleResize = () => {
        this.props.setCanvasParamsSize({
            height: INITIAL_CANVAS_HEIGHT,
            width:  window.innerWidth * VIEW_PORT_SCALE
        });
    }

    private prepareObjectModelAndRender() {
        const { ctx } = this;
        if (!ctx) { return; }

        const { objectModel, canvasSize } = this.props;
        const canvasParams = {ctx, width: canvasSize.width, height: canvasSize.height};

        const elements = objectModel;
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
        handleElementMouseEvents('onContextMenu', this.elements, e);
    };

    private handleCanvasMouseMove = (e: MouseEvent) => {
        const { onMouseMove } = this.props;
        const { nativeEvent } = e;
        const pointerPosition = {x: nativeEvent.offsetX, y: nativeEvent.offsetY};

        if (onMouseMove) {
            onMouseMove(pointerPosition);
        }

        handleElementMouseEvents('onMouseMove', this.elements, e);
    };
}

const mapStateToProps = (state: IState) => ({
    canvasSize: getCanvasSize(state)
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
    setCanvasParamsSize
}, dispatch);

export const CanvasContainer = connect(mapStateToProps, mapDispatchToProps)(CanvasContainerComponent);
