/* tslint:disable */
import * as React from 'react';
import { MessageDelivery, ISubscription, IMessage, MessageType, MouseMessage } from 'src/message-delivery';
import { CanvasContainer } from '../canvas/CanvasContainer';
import { CanvasElement, ISize } from '../canvas/CanvasElement';
import { MouseEvent, TEXT, VIEW_PORT_SCALE } from '../canvas/constants';
import { TextCanvasElement } from '../canvas/elements/TextCanvasElement';
import { getTextParams, handleElementMouseEvents, CanvasObjectModel } from '../canvas/utils/objectModel';
import './MarkerHihghlight.css';
import { HighlightBrusheTypes } from 'src/canvas/plugins/brush';

import { connect } from 'react-redux';
import { startRangeSelection, stopRangeSelection, continueRangeSelection, setCurrentBrush, removeHoveredElement, setHoveredElement } from './redux-layers/actions';
import { getShouldContinueRangeSelection } from './redux-layers/selectors';
import { HoverLayer } from './redux-layers/hover-layer';
import { SyntaxLayer } from './redux-layers/syntax-layer';
import { DotLayer } from './redux-layers/dot-layer';

export class MarkerHighlight extends React.Component {
    mainTextElements;
    messageDelivery = new MessageDelivery();


    constructor(props) {
        super(props);

        this.state = {
            text: TEXT,
            canvasSize: {
                width: 0,
                height: 0
            },
            selectedBrush: HighlightBrusheTypes.SIMPLE_CHAR
        }
    }

    render() {
        const { canvasSize, selectedBrush } = this.state;
        const { setCurrentBrush } = this.props;
        const com = this.prepareObjectModel();
        const mainTextElements = com === null ? [] : com.getNodes();
        const height = com === null ? 0 : com.maxY;
        console.log('heavy render');

        return (
            <div>
                <div>
                    <button onClick={() => setCurrentBrush(HighlightBrusheTypes.SUBJECT)}>Подлежащее</button>
                    <button onClick={() => setCurrentBrush(HighlightBrusheTypes.PREDICATE)}>Сказуемое</button>
                </div>
                <div
                    className="layers"
                    style={{ height: height / VIEW_PORT_SCALE }}
                    onMouseMove={this.deliverMouseMoveMessage}
                    onMouseDown={this.deliverMouseDownMessage}
                    onMouseUp={this.deliverMouseUpMessage}
                    onClick={this.deliverMouseClickMessage}
                    onMouseLeave={this.stopActiveMouseReaction}>
                        <SyntaxLayer
                            height={height}
                            mix="canvas-container-layer"
                            mainTextElements={mainTextElements} 
                            subscription={this.messageDelivery} />
                        <HoverLayer
                            height={height}
                            mix="canvas-container-layer"
                            subscription={this.messageDelivery} />
                        <DotLayer
                            height={height}
                            mix="canvas-container-layer"
                            mainTextElements={mainTextElements} 
                            subscription={this.messageDelivery} />
                        <CanvasContainer
                            height={height}
                            objectModel={mainTextElements}
                            mix="canvas-container-layer"
                            onContextReady={this.setCanvasContext} />
                </div>
                <button onClick={this.serialize}>Сериализовать</button>
            </div>
        );
    }

    deliverMouseMoveMessage = (e) => {
        this.deliverMouseMessage(MessageType.mouseMove, e);
    };

    deliverMouseDownMessage = (e) => {
        this.deliverMouseMessage(MessageType.mouseDown, e);
    };

    deliverMouseUpMessage = (e) => {
        if (this.lastHoveredElement) {
            this.props.stopRangeSelection(this.lastHoveredElement.index);
        }
        
        this.deliverMouseMessage(MessageType.mouseUp, e);
    };

    deliverMouseClickMessage = (e) => {
        this.deliverMouseMessage(MessageType.mouseClick, e);
    };

    deliverMouseMessage = (type, e) => {
        const x = e.nativeEvent.offsetX;
        const y = e.nativeEvent.offsetY;

        const message = new MouseMessage();
        message.type = type;
        message.pointerPosition = {x, y};
        
        this.messageDelivery.dispatchMessage(message);
        handleElementMouseEvents(message.type, this.mainTextElements, message);
    };

    stopActiveMouseReaction = () => {
        if (this.lastHoveredElement) {
            this.props.stopRangeSelection(this.lastHoveredElement.index);
            this.props.textElementHovered(null);
        }
    };

    serialize = () => {
    };

    setCanvasContext = (width, height, ctx) => {
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

    prepareObjectModel = () => {
        const { text, canvasSize, ctx } = this.state;

        if (ctx) {
            const canvasParams = {
                ctx,
                ...canvasSize
            };
            const textParams = getTextParams(text, 50, { x: 0, y: 100 });
            const com = new CanvasObjectModel(canvasParams, textParams);
            this.mainTextElements = com.getNodes();

            this.mainTextElements.forEach(textElement => {
                if (textElement instanceof TextCanvasElement) {
                    textElement.onMouseDown = () => this.props.startRangeSelection(textElement.index);
                    textElement.onMouseEnter = () => this.props.textElementEntered(textElement);
                    textElement.onMouseMove = () => {
                        this.props.textElementHovered(textElement);
                        this.lastHoveredElement = textElement;
                    }
                    textElement.onMouseLeave = () => this.props.textElementLeaved();
                }
            });

            return com;
        }

        return null;
    }
}

const mapStateToProps = (state) => ({
    // shouldContinueSelection: getShouldContinueRangeSelection(state)
});

const mapDispatchToProps = (dispatch) => ({
    startRangeSelection: wordIndex => dispatch(startRangeSelection(wordIndex)),
    stopRangeSelection: wordIndex => dispatch(stopRangeSelection(wordIndex)),
    textElementEntered: element => dispatch(continueRangeSelection(element)),
    setCurrentBrush: brushType => dispatch(setCurrentBrush(brushType)),
    textElementLeaved: () => dispatch(removeHoveredElement()),
    textElementHovered: element => dispatch(setHoveredElement(element)) 
});

export const ConnectedMarkerHighlight = connect(mapStateToProps, mapDispatchToProps)(MarkerHighlight);
