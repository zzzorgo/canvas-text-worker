import * as React from 'react';
import { CanvasContainer } from 'src/canvas/CanvasContainer';
import { CanvasElement } from 'src/canvas/CanvasElement';
import { CharCanvasElement } from 'src/canvas/elements/CharCanvasElement';
import { TextCanvasElement } from 'src/canvas/elements/TextCanvasElement';
import { HighlightBrusheTypes, simpleBrushPlugin } from 'src/canvas/plugins/brush';
import { handleElementMouseEvents } from 'src/canvas/utils/objectModel';
import { HighlightingMode, HighlightingState } from 'src/marker/HighlightingState';
import { ISubscriberProps } from 'src/marker/MarkerHihghlight';
import { IMessage, IMouseMessage } from 'src/message-delivery';
import { SimpleSelectionLayerTarget } from './target';

interface IBrushesState {
    [HighlightBrusheTypes.NONE]: number[],
    [HighlightBrusheTypes.SIMPLE]: number[],
    [HighlightBrusheTypes.UNICODE]: number[],
    [HighlightBrusheTypes.UNDERSCORE]: number[]
}

interface ISimpleSelectionLayerProps extends ISubscriberProps {
    mainTextElements: TextCanvasElement[]
}

interface ISimpleSelectionLayerState {
    brushes: IBrushesState,
    selectedBrush: HighlightBrusheTypes,
}

export class SimpleSelectionLayer extends React.Component<ISimpleSelectionLayerProps, ISimpleSelectionLayerState> {
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

    public render() {
        return (
            <CanvasContainer
                objectModel={this.prepareObjectModel()}
                mix="canvas-container-layer" />
        );
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
    
    private prepareObjectModel = () => {
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
}
