/* tslint:disable */
import * as React from 'react';
import { MessageDelivery, ISubscription, IMessage, MessageType } from 'src/message-delivery';
import { CanvasContainer } from '../canvas/CanvasContainer';
import { CanvasElement, ISize } from '../canvas/CanvasElement';
import { MouseEvent, TEXT, VIEW_PORT_SCALE } from '../canvas/constants';
import { TextCanvasElement } from '../canvas/elements/TextCanvasElement';
import { getElementsFromText, getTextParams, handleElementMouseEvents } from '../canvas/utils/objectModel';
import './MarkerHihghlight.css';
import { HoverLayer } from './layers/hover/layer';
import { HighlightBrusheTypes } from 'src/canvas/plugins/brush';
import {
    CharSimpleSelectionLayer,
    SentenceSyntaxLayer,
    WordSimpleSelectionLayer
} from './layers/simpleSelection';
import { SentenceParts } from './layers/simpleSelection/wrappers/syntax/mechanics';
import { connect } from 'react-redux';
import { startRangeSelection, stopRangeSelection, continueRangeSelection } from './redux-layers/actions';
import { PredicateLayer, SubjectLayer } from './redux-layers/predicate';

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
        const mainTextElements = this.prepareObjectModel();
        console.log('heavy render');

        return (
            <div>
                <div>
                    <button onClick={this.selectSimpleHighlight}>1</button>
                    <button onClick={this.selectUnicodeHighlight}>2</button>
                    <button onClick={this.selectSubjectHighlight}>подлежащее</button>
                    <button onClick={this.selectPredicateHighlight}>сказуемое</button>
                </div>
                <div
                    className="layers"
                    style={{ height: canvasSize.height / VIEW_PORT_SCALE }}
                    onMouseMove={this.deliverMouseMoveMessage}
                    onMouseDown={this.deliverMouseDownMessage}
                    onMouseUp={this.deliverMouseUpMessage}
                    onClick={this.deliverMouseClickMessage}>
                        {/* <Layer3
                            mix="canvas-container-layer"
                            mainTextElements={mainTextElements} /> */}
                        <PredicateLayer
                            mix="canvas-container-layer"
                            mainTextElements={mainTextElements} 
                            subscription={this.messageDelivery} />
                        <SubjectLayer
                            mix="canvas-container-layer"
                            mainTextElements={mainTextElements} 
                            subscription={this.messageDelivery} />
                        <CanvasContainer
                            objectModel={mainTextElements}
                            mix="canvas-container-layer"
                            onContextReady={this.setCanvasContext} />
                </div>
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
        this.deliverMouseMessage(MessageType.mouseUp, e);
    };

    deliverMouseClickMessage = (e) => {
        this.deliverMouseMessage(MessageType.mouseClick, e);
    };

    deliverMouseMessage = (type, e) => {
        const x = e.nativeEvent.offsetX;
        const y = e.nativeEvent.offsetY;
        const message = {
            type,
            pointerPosition: {x, y}
        }
        
        this.messageDelivery.dispatchMessage(message);
        handleElementMouseEvents(message.type, this.mainTextElements, message);
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
            const textParams = getTextParams(text, 50, { x: 0, y: 0 });
            this.mainTextElements = getElementsFromText(canvasParams, textParams);

            this.mainTextElements.forEach(textElement => {
                if (textElement instanceof TextCanvasElement) {
                    textElement.onMouseDown = () => this.props.startRangeSelection(textElement.index);
                    textElement.onMouseEnter = () => this.props.continueRangeSelection(textElement.index);
                    textElement.onMouseUp = () => this.props.stopRangeSelection(textElement.index);
                }
            });

            return this.mainTextElements;
        }

        return [];
    }
}

const mapDispatchToProps = (dispatch) => ({
    startRangeSelection: wordIndex => dispatch(startRangeSelection(wordIndex)),
    stopRangeSelection: wordIndex => dispatch(stopRangeSelection(wordIndex)),
    continueRangeSelection: wordIndex => dispatch(continueRangeSelection(wordIndex))
});

export const ConnectedMarkerHighlight = connect(null, mapDispatchToProps)(MarkerHighlight);
