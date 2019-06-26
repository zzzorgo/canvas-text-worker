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
import { prepareObjectModel } from '../redux-like/selectors';
import { connect } from 'react-redux';
import { Layer, Layer2 } from '../redux-like/Layer';
import { wordClicked } from '../redux-like/actions';

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
                        {/* <CharSimpleSelectionLayer
                            active={selectedBrush === HighlightBrusheTypes.SIMPLE_CHAR}
                            mainTextElements={mainTextElements}
                            subscription={this.messageDelivery} />
                        <WordSimpleSelectionLayer
                            active={selectedBrush === HighlightBrusheTypes.SIMPLE_WORD}
                            mainTextElements={mainTextElements}
                            subscription={this.messageDelivery} />
                        <CompositeLayer>
                            <SentenceSyntaxLayer
                                sentencePart={SentenceParts.SUBJECT}
                                active={selectedBrush === HighlightBrusheTypes.SUBJECT}
                                mainTextElements={mainTextElements}
                                subscription={this.messageDelivery} />
                            <SentenceSyntaxLayer
                                sentencePart={SentenceParts.PREDICATE}
                                active={selectedBrush === HighlightBrusheTypes.PREDICATE}
                                mainTextElements={mainTextElements}
                                subscription={this.messageDelivery} />
                        </CompositeLayer> */}
                        {/* <HoverLayer
                            subscription={this.messageDelivery}
                            mainTextElements={mainTextElements} /> */}
                        <Layer2
                            mix="canvas-container-layer"
                            mainTextElements={mainTextElements} 
                            subscription={this.messageDelivery} />
                        <Layer
                            mix="canvas-container-layer"
                            mainTextElements={mainTextElements} />
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
                    textElement.onClick = () => this.props.wordClicked(textElement.index);
                }
            });

            return this.mainTextElements;
        }

        return [];
    }

    // private selectSimpleHighlight = () => {
    //     this.setState({ selectedBrush: HighlightBrusheTypes.SIMPLE_CHAR });
    // };

    // private selectUnicodeHighlight = () => {
    //     this.setState({ selectedBrush: HighlightBrusheTypes.SIMPLE_WORD });
    // };

    // private selectSubjectHighlight = () => {
    //     this.setState({ selectedBrush: HighlightBrusheTypes.SUBJECT });
    // };

    // private selectPredicateHighlight = () => {
    //     this.setState({ selectedBrush: HighlightBrusheTypes.PREDICATE });
    // };
}

// class CompositeLayer extends React.Component {
//     public render() {
//         const { children } = this.props;

//         return React.Children.map(children, child => child);
//     }
// }
const mapDispatchToProps = (dispatch) => ({
    wordClicked: wordIndex => dispatch(wordClicked(wordIndex))
});

export const ConnectedMarkerHighlight = connect(null, mapDispatchToProps)(MarkerHighlight);
