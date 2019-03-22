/* tslint:disable */
import * as React from 'react';
import { connect } from 'react-redux';
import { IState } from 'src';
import { MessageDelivery, ISubscription, IDeliveryTarget, IMessage, IHoverMessage, MessageType } from 'src/message-delivery';
import { CanvasContainer } from '../canvas/CanvasContainer';
import { CanvasElement, IPoint, ISize } from '../canvas/CanvasElement';
import { MouseEvent, TEXT, VIEW_PORT_SCALE } from '../canvas/constants';
import { CharCanvasElement } from '../canvas/elements/CharCanvasElement';
import { TextCanvasElement } from '../canvas/elements/TextCanvasElement';
import { HighlightBrusheTypes, simpleBrushPlugin } from '../canvas/plugins/brush';
import { hoverPlugin } from '../canvas/plugins/hover';
import { getElementsFromText, getTextParams, toggleArrayElement } from '../canvas/utils/objectModel';
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
    brushes: IBrushesState,
    highlightedWords: number[],
    selectedBrush: HighlightBrusheTypes,
    text: string,
    ctx?: CanvasRenderingContext2D
}

interface IMarkerHighlightProps {
    canvasSize: ISize
}

class MarkerHighlightComponent extends React.Component<IMarkerHighlightProps, IMarkerHighlightState> {
    private hilightingState: HighlightingState = new HighlightingState();
    private mainTextElements: TextCanvasElement[];
    private messageDelivery: MessageDelivery = new MessageDelivery();

    constructor(props: IMarkerHighlightProps) {
        super(props);

        this.state = {
            brushes: {
                [HighlightBrusheTypes.NONE]: [],
                [HighlightBrusheTypes.SIMPLE]: [0, 1, 2, 3],
                [HighlightBrusheTypes.UNICODE]: [],
                [HighlightBrusheTypes.UNDERSCORE]: []
            },
            highlightedWords: [],
            selectedBrush: HighlightBrusheTypes.SIMPLE,
            text: TEXT
        }
    }

    public render() {
        const { brushes } = this.state;
        const { canvasSize } = this.props;
        const mainTextElements = this.prepareObjectModel();
        console.log('heavy render');

        return (
            <div>
                <div>
                    <button onClick={this.selectSimpleHighlight}>1</button>
                    <button onClick={this.selectUnicodeHighlight}>2</button>
                    <button onClick={this.selectUnderscoreHighlight}>3</button>
                </div>
                <div className="layers" style={{ height: canvasSize.height / VIEW_PORT_SCALE }} onMouseMove={this.deliverHoverMessage}>
                    <SimpleSelectionLayer
                        subscription={this.messageDelivery}
                        mainTextElements={mainTextElements}
                        selectedElementIds={brushes[HighlightBrusheTypes.SIMPLE]} />
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

    private deliverHoverMessage = (e: MouseEvent) => {
        const hoverMessage = {
            type: MessageType.hover,
            pointerPosition: {x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY}
        }
        
        this.messageDelivery.dispatchMessage(hoverMessage);
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
            this.bindEventHandlers(this.mainTextElements);

            return this.mainTextElements;
        }

        return [];
    }

    private bindEventHandlers = (elements: CanvasElement[]) => {
        elements.forEach(word => {
            if (word instanceof TextCanvasElement) {
                word.onContextMenu = this.getWordContexMenuHandler(word);
            }

            word.children.forEach(char => {
                if (char instanceof CharCanvasElement) {
                    char.onMouseDown = this.getCharMouseDownHandler(char);
                    char.onMouseMove = this.getCharMouseMoveHandler(char);
                    char.onMouseUp = this.getCharMouseUpHandler(char);
                }
            }
            )
        });
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

    /// Event handlers

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

    private getWordContexMenuHandler = (word: TextCanvasElement) => (e: MouseEvent) => {
        e.preventDefault();
        this.setState({
            highlightedWords: toggleArrayElement(this.state.highlightedWords, word.index)
        });
    }

    private selectSimpleHighlight = () => {
        this.setState({ selectedBrush: HighlightBrusheTypes.SIMPLE });
    };

    private selectUnicodeHighlight = () => {
        this.setState({ selectedBrush: HighlightBrusheTypes.UNICODE });
    };

    private selectUnderscoreHighlight = () => {
        this.setState({ selectedBrush: HighlightBrusheTypes.UNDERSCORE });
    };
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
        if (message.type === MessageType.hover) {
            const hoverMessage = message as IHoverMessage;
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

interface ISimpleSelectionLayerProps extends ISubscriberProps {
    mainTextElements: TextCanvasElement[],
    selectedElementIds: number[]
}

class SimpleSelectionLayer extends React.Component<ISimpleSelectionLayerProps> {
    public render() {
        return (
            <CanvasContainer
                objectModel={this.prepareObjectModel()}
                mix="canvas-container-layer" />
        );
    }

    prepareObjectModel = () => {
        const { mainTextElements, selectedElementIds } = this.props;
        const elements: CanvasElement[] = [];

        mainTextElements.forEach(textElement => {
            textElement.children.forEach(charElement => {
                if (charElement instanceof CharCanvasElement) {
                    const simpleBrushElement = simpleBrushPlugin(charElement, selectedElementIds);
                    if (simpleBrushElement && simpleBrushElement.rect) {
                        elements.push(simpleBrushElement);
                    }
                }
            });
        });

        return elements;
    };
}
