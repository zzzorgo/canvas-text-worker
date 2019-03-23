import * as React from 'react';
import { CanvasContainer } from 'src/canvas/CanvasContainer';
import { CanvasElement, IIndexedCanvasElement } from 'src/canvas/CanvasElement';
import { TextCanvasElement } from 'src/canvas/elements/TextCanvasElement';
import { simpleBrushPlugin } from 'src/canvas/plugins/brush';
import { handleElementMouseEvents } from 'src/canvas/utils/objectModel';
import { HighlightingMode, HighlightingState } from 'src/marker/HighlightingState';
import { ISubscriberProps } from 'src/marker/MarkerHihghlight';
import { IMouseMessage } from 'src/message-delivery';
import { SimpleSelectionLayerTarget } from './target';

interface ISimpleSelectionLayerProps extends ISubscriberProps {
    mainTextElements: TextCanvasElement[],
    active: boolean
}

interface ISimpleSelectionLayerState {
    selectedElements: number[]
}

export class SimpleWordSelectionLayer extends React.Component<ISimpleSelectionLayerProps, ISimpleSelectionLayerState> {
    private hilightingState: HighlightingState = new HighlightingState();

    constructor(props: ISimpleSelectionLayerProps) {
        super(props);

        const target = new SimpleSelectionLayerTarget(this.mouseMessageHandler);
        props.subscription.subscribe(target);

        this.state = {
            selectedElements: [0, 1, 2, 3]
        }
    }

    public render() {
        return (
            <CanvasContainer
                objectModel={this.prepareObjectModel()}
                mix="canvas-container-layer" />
        );
    }

    private mouseMessageHandler = (message: IMouseMessage) => {
        const { active } = this.props;

        if (active) {
            const { mainTextElements } = this.props;
            handleElementMouseEvents(message.type, mainTextElements, message);
        }
    };
    
    private prepareObjectModel = () => {
        const { selectedElements } = this.state;
        const { mainTextElements } = this.props;
        const elements: CanvasElement[] = [];
        
        mainTextElements.forEach(textElement => {
            if (textElement instanceof TextCanvasElement) {
                textElement.onMouseDown = this.getCharMouseDownHandler(textElement);
                textElement.onMouseMove = this.getCharMouseMoveHandler(textElement);
                textElement.onMouseUp = this.getCharMouseUpHandler(textElement);

                const simpleBrushElement = simpleBrushPlugin(textElement, selectedElements);

                if (simpleBrushElement && simpleBrushElement.rect) {
                    elements.push(simpleBrushElement);
                }
            }
        });

        return elements;
    };

    private getCharMouseDownHandler = (word: IIndexedCanvasElement) => () => {
        const { selectedElements } = this.state;
        const alreadyHighlighted = selectedElements.includes(word.index);    
        this.hilightingState.start = word.index;
        this.hilightingState.mode = alreadyHighlighted ? HighlightingMode.REMOVING : HighlightingMode.ADDING;
    }
    
    private getCharMouseMoveHandler = (word: IIndexedCanvasElement) => () => {
        this.updateHighlightedWords(word);
    };
    
    private getCharMouseUpHandler = (word: IIndexedCanvasElement) => () => {
        this.updateHighlightedWords(word);
        this.hilightingState.mode = HighlightingMode.STAND_BY;
    }

    private updateHighlightedWords = (word: IIndexedCanvasElement) => {
        const { selectedElements } = this.state;
        const newHighlightedChars = this.hilightingState.getNewHighlightedChars(word.index, selectedElements);
        this.setState({ selectedElements: newHighlightedChars });
    };
}
