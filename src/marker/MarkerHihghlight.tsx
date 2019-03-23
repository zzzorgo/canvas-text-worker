/* tslint:disable */
import * as React from 'react';
import { connect } from 'react-redux';
import { IState } from 'src';
import { MessageDelivery, ISubscription, IMessage, MessageType } from 'src/message-delivery';
import { CanvasContainer } from '../canvas/CanvasContainer';
import { CanvasElement, ISize } from '../canvas/CanvasElement';
import { MouseEvent, TEXT, VIEW_PORT_SCALE } from '../canvas/constants';
import { TextCanvasElement } from '../canvas/elements/TextCanvasElement';
import { getElementsFromText, getTextParams } from '../canvas/utils/objectModel';
import './MarkerHihghlight.css';
import { getCanvasSize } from './selectors';
import { SimpleSelectionLayer } from './layers/simpleSelection/component';
import { HoverLayer } from './layers/hover/component';

export type MouseEventHandler = (message: IMessage) => void;

export type RenderPlugin = (element: CanvasElement) => void;

export interface ISubscriberProps {
    subscription: ISubscription    
}

interface IMarkerHighlightState {
    highlightedWords: number[]
    text: string,
    ctx?: CanvasRenderingContext2D
}

interface IMarkerHighlightProps {
    canvasSize: ISize
}

class MarkerHighlightComponent extends React.Component<IMarkerHighlightProps, IMarkerHighlightState> {
    private mainTextElements: TextCanvasElement[];
    private messageDelivery: MessageDelivery = new MessageDelivery();

    constructor(props: IMarkerHighlightProps) {
        super(props);

        this.state = {
            highlightedWords: [],
            text: TEXT
        }
    }

    public render() {
        const { canvasSize } = this.props;
        const mainTextElements = this.prepareObjectModel();
        console.log('heavy render');

        return (
            <div>
                {/* <div>
                    <button onClick={this.selectSimpleHighlight}>1</button>
                    <button onClick={this.selectUnicodeHighlight}>2</button>
                    <button onClick={this.selectUnderscoreHighlight}>3</button>
                </div> */}
                <div
                    className="layers"
                    style={{ height: canvasSize.height / VIEW_PORT_SCALE }}
                    onMouseMove={this.deliverMouseMoveMessage}
                    onMouseDown={this.deliverMouseDownMessage}
                    onMouseUp={this.deliverMouseUpMessage}>
                        <SimpleSelectionLayer
                            subscription={this.messageDelivery}
                            mainTextElements={mainTextElements} />
                        <HoverLayer
                            subscription={this.messageDelivery}
                            mainTextElements={mainTextElements} />
                        <CanvasContainer
                            objectModel={mainTextElements}
                            mix="canvas-container-layer"
                            onContextReady={this.setCanvasContext} />
                </div>
            </div>
        );
    }

    private deliverMouseMoveMessage = (e: MouseEvent) => {
        const message = {
            type: MessageType.mouseMove,
            pointerPosition: {x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY}
        }
        
        this.messageDelivery.dispatchMessage(message);
    };

    private deliverMouseDownMessage = (e: MouseEvent) => {
        const message = {
            type: MessageType.mouseDown,
            pointerPosition: {x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY}
        }
        
        this.messageDelivery.dispatchMessage(message);
    };

    private deliverMouseUpMessage = (e: MouseEvent) => {
        const message = {
            type: MessageType.mouseUp,
            pointerPosition: {x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY}
        }
        
        this.messageDelivery.dispatchMessage(message);
    };

    private setCanvasContext = (ctx: CanvasRenderingContext2D) => {
        this.setState({ ctx });
    }

    private prepareObjectModel = () => {
        const { text, ctx } = this.state;
        const { canvasSize } = this.props;

        if (ctx) {
            const canvasParams = {
                ctx,
                width: canvasSize.width,
                height: canvasSize.height
            }

            const textParams = getTextParams(text, 50, { x: 0, y: 0 });
            this.mainTextElements = getElementsFromText(canvasParams, textParams);

            return this.mainTextElements;
        }

        return [];
    }

    /// Event handlers

    // private selectSimpleHighlight = () => {
    //     this.setState({ selectedBrush: HighlightBrusheTypes.SIMPLE });
    // };

    // private selectUnicodeHighlight = () => {
    //     this.setState({ selectedBrush: HighlightBrusheTypes.UNICODE });
    // };

    // private selectUnderscoreHighlight = () => {
    //     this.setState({ selectedBrush: HighlightBrusheTypes.UNDERSCORE });
    // };
}

const mapStateToProps = (state: IState) => ({
    canvasSize: getCanvasSize(state)
});

export const MarkerHighlight = connect(mapStateToProps)(MarkerHighlightComponent);
