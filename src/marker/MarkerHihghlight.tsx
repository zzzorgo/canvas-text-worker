/* tslint:disable */
import * as React from 'react';
import { MessageDelivery, ISubscription, IMessage, MessageType } from 'src/message-delivery';
import { CanvasContainer } from '../canvas/CanvasContainer';
import { CanvasElement, ISize } from '../canvas/CanvasElement';
import { MouseEvent, TEXT, VIEW_PORT_SCALE } from '../canvas/constants';
import { TextCanvasElement } from '../canvas/elements/TextCanvasElement';
import { getElementsFromText, getTextParams } from '../canvas/utils/objectModel';
import './MarkerHihghlight.css';
import { SimpleSelectionLayer } from './layers/simpleSelection/component';
import { HoverLayer } from './layers/hover/component';
import { SimpleWordSelectionLayer } from './layers/simpleWordSelection/component';

export type MouseEventHandler = (message: IMessage) => void;

export type RenderPlugin = (element: CanvasElement) => void;

export interface ISubscriberProps {
    subscription: ISubscription    
}

interface IMarkerHighlightState {
    highlightedWords: number[]
    text: string,
    canvasSize: ISize,
    ctx?: CanvasRenderingContext2D
}

interface IMarkerHighlightProps {
}

export class MarkerHighlight extends React.Component<IMarkerHighlightProps, IMarkerHighlightState> {
    private mainTextElements: TextCanvasElement[];
    private messageDelivery: MessageDelivery = new MessageDelivery();

    constructor(props: IMarkerHighlightProps) {
        super(props);

        this.state = {
            highlightedWords: [],
            text: TEXT,
            canvasSize: {
                width: 0,
                height: 0
            }
        }
    }

    public render() {
        const { canvasSize } = this.state;
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
                        <SimpleWordSelectionLayer
                            active={false}
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

    private setCanvasContext = (width: number, height: number, ctx?: CanvasRenderingContext2D) => {
        if (!ctx) {
            this.setState({
                canvasSize: { width, height }
            });
        } else {
            this.setState({
                canvasSize: { width, height },
                ctx
            });
        }
    }

    private prepareObjectModel = () => {
        const { text, canvasSize, ctx } = this.state;

        if (ctx) {
            const canvasParams = {
                ctx,
                ...canvasSize
            };
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
