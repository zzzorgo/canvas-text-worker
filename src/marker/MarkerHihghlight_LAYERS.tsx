/* tslint:disable */
import * as React from 'react';
import { connect } from 'react-redux';
import { IState } from 'src';
import { MessageDelivery, ISubscription, IDeliveryTarget, IMessage, IMouseMessage, MessageType } from 'src/message-delivery';
import { CanvasContainer } from '../canvas/CanvasContainer';
import { CanvasElement, IPoint, ISize } from '../canvas/CanvasElement';
import { MouseEvent, TEXT, VIEW_PORT_SCALE } from '../canvas/constants';
import { CharCanvasElement } from '../canvas/elements/CharCanvasElement';
import { TextCanvasElement } from '../canvas/elements/TextCanvasElement';
import { HighlightBrusheTypes, simpleBrushPlugin } from '../canvas/plugins/brush';
import { hoverPlugin } from '../canvas/plugins/hover';
import { getElementsFromText, getTextParams, handleElementMouseEvents } from '../canvas/utils/objectModel';
import { HighlightingMode, HighlightingState } from './HighlightingState';
import './MarkerHihghlight_LAYERS.css';
import { getCanvasSize } from './selectors';

export type RenderPlugin = (element: CanvasElement) => void;

interface ISubscriberProps {
    subscription: ISubscription    
}

interface IBrushesState {
    [HighlightBrusheTypes.NONE]: number[],
    [HighlightBrusheTypes.SIMPLE]: number[],
    [HighlightBrusheTypes.UNICODE]: number[],
    [HighlightBrusheTypes.UNDERSCORE]: number[]
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

interface IHoverLayerProps extends ISubscriberProps {
    mainTextElements: TextCanvasElement[]
}

interface IHoverLayerState {
    pointerPosition: IPoint
}

class HoverLayerTarget implements IDeliveryTarget {
    private hoverHandler: (pointerPosition: IPoint) => void;

    constructor(hoverHandler: (pointerPosition: IPoint) => void) {
        this.hoverHandler = hoverHandler;
    }

    handleMessage(message: IMessage) {
        if (message.type === MessageType.mouseMove) {
            const hoverMessage = message as IMouseMessage;
            this.hoverHandler(hoverMessage.pointerPosition);
        }
    }
}

class HoverLayer extends React.Component<IHoverLayerProps, IHoverLayerState> {
    state = {
        pointerPosition: { x: -1, y: -1 }
    };

    constructor(props: IHoverLayerProps) {
        super(props);

        const target = new HoverLayerTarget(this.setPointerPosition);
        props.subscription.subscribe(target);
    }

    private setPointerPosition = (pointerPosition: IPoint) => {
        this.setState({ pointerPosition });
    }

    public render() {
        return (
            <CanvasContainer
                objectModel={this.prepareObjectModel()}
                mix="canvas-container-layer hover-layer"
                onMouseMove={this.setPointerPosition} />
        );
    }

    prepareObjectModel = () => {
        const { mainTextElements } = this.props;
        const { pointerPosition } = this.state;
        const elements: CanvasElement[] = [];

        mainTextElements.forEach(element => {
            const hoverElement = hoverPlugin(element, pointerPosition, 'black');
            if (hoverElement && hoverElement.rect) {
                elements.push(hoverElement);
            }

            element.children.forEach(char => {
                if (char instanceof CharCanvasElement) {
                    const hoverElement = hoverPlugin(char, pointerPosition, 'black');

                    if (hoverElement && hoverElement.rect) {
                        elements.push(hoverElement);
                    }
                }
            });
        });

        return elements;
    };
}

type MouseEventHandler = (message: IMessage) => void;

class SimpleSelectionLayerTarget implements IDeliveryTarget {
    private mouseMoveHandler: MouseEventHandler;
    private mouseDownHandler: MouseEventHandler;
    private mouseUpHandler: MouseEventHandler;

    constructor(mouseMoveHandler: MouseEventHandler, mouseDownHandler: MouseEventHandler, mouseUpHandler: MouseEventHandler) {
        this.mouseMoveHandler = mouseMoveHandler;
        this.mouseDownHandler = mouseDownHandler;
        this.mouseUpHandler = mouseUpHandler;
    }

    handleMessage(message: IMessage) {
        switch (message.type) {
            case MessageType.mouseMove: {
                this.mouseMoveHandler(message);
                break;
            }
                
            case MessageType.mouseDown: {
                this.mouseDownHandler(message);
                break;
            }
            
            case MessageType.mouseUp: {
                this.mouseUpHandler(message);
                break;
            }
        
            default:
                break;
        }
    }
}

interface ISimpleSelectionLayerProps extends ISubscriberProps {
    mainTextElements: TextCanvasElement[]
}


interface ISimpleSelectionLayerState {
    brushes: IBrushesState,
    selectedBrush: HighlightBrusheTypes,
}

class SimpleSelectionLayer extends React.Component<ISimpleSelectionLayerProps, ISimpleSelectionLayerState> {
    private hilightingState: HighlightingState = new HighlightingState();

    constructor(props: ISimpleSelectionLayerProps) {
        super(props);

        const target = new SimpleSelectionLayerTarget(
            this.handleCanvasMouseMove,
            this.handleCanvasMouseDown,
            this.handleCanvasMouseUp
        );
        props.subscription.subscribe(target);

        this.state = {
            brushes: {
                [HighlightBrusheTypes.NONE]: [],
                [HighlightBrusheTypes.SIMPLE]: [0, 1, 2, 3],
                [HighlightBrusheTypes.UNICODE]: [],
                [HighlightBrusheTypes.UNDERSCORE]: []
            },
            selectedBrush: HighlightBrusheTypes.SIMPLE
        }
    }

    private handleCanvasMouseDown = (message: IMessage) => {
        const { mainTextElements } = this.props;
        handleElementMouseEvents('onMouseDown', mainTextElements, message as IMouseMessage);
    };

    private handleCanvasMouseUp = (message: IMessage) => {
        const { mainTextElements } = this.props;
        handleElementMouseEvents('onMouseUp', mainTextElements, message as IMouseMessage);
    };

    private handleCanvasMouseMove = (message: IMessage) => {
        const { mainTextElements } = this.props;
        handleElementMouseEvents('onMouseMove', mainTextElements, message as IMouseMessage);
    };
    
    prepareObjectModel = () => {
        const { brushes, selectedBrush } = this.state;
        const { mainTextElements } = this.props;
        const elements: CanvasElement[] = [];
        
        mainTextElements.forEach(textElement => {
            textElement.children.forEach(charElement => {
                if (charElement instanceof CharCanvasElement) {
                    charElement.onMouseDown = this.getCharMouseDownHandler(charElement);
                    charElement.onMouseMove = this.getCharMouseMoveHandler(charElement);
                    charElement.onMouseUp = this.getCharMouseUpHandler(charElement);
                    
                    const simpleBrushElement = simpleBrushPlugin(charElement, brushes[selectedBrush]);

                    if (simpleBrushElement && simpleBrushElement.rect) {
                        elements.push(simpleBrushElement);
                    }
                }
            });
        });

        return elements;
    };

    private getCharMouseDownHandler = (char: CharCanvasElement) => () => {
        const { brushes, selectedBrush } = this.state;
        const alreadyHighlighted = brushes[selectedBrush].includes(char.index);
    
        this.hilightingState.start = char.index;
        this.hilightingState.mode = alreadyHighlighted ? HighlightingMode.REMOVING : HighlightingMode.ADDING;
    }
    
    private getCharMouseMoveHandler = (char: CharCanvasElement) => () => {
        this.updateHighlightedChars(char);
    };
    
    private getCharMouseUpHandler = (char: CharCanvasElement) => () => {
        this.updateHighlightedChars(char);
        this.hilightingState.mode = HighlightingMode.STAND_BY;
    }

    private updateHighlightedChars = (char: CharCanvasElement) => {
        const { brushes, selectedBrush } = this.state;
        const newHighlightedChars = this.hilightingState.getNewHighlightedChars(char.index, brushes[selectedBrush]);

        if (newHighlightedChars !== brushes[selectedBrush]) {
            const newBrushes = {
                ...brushes,
                [selectedBrush]: newHighlightedChars
            };
            this.setState({ brushes: newBrushes });
        }
    };
    
    public render() {
        return (
            <CanvasContainer
                objectModel={this.prepareObjectModel()}
                mix="canvas-container-layer" />
        );
    }
}
