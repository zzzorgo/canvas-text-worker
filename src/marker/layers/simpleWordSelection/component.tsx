import * as React from 'react';
import { CanvasContainer } from 'src/canvas/CanvasContainer';
import { CanvasElement, IIndexedCanvasElement } from 'src/canvas/CanvasElement';
import { TextCanvasElement } from 'src/canvas/elements/TextCanvasElement';
import { simpleBrushPlugin } from 'src/canvas/plugins/brush';
import { HighlightingMode, HighlightingState } from 'src/marker/HighlightingState';

interface ISimpleSelectionLayerProps {
    mainTextElements: TextCanvasElement[],
    active: boolean
}

interface ISimpleSelectionLayerState {
    selectedElements: number[]
}

export class SimpleWordSelectionLayer extends React.Component<ISimpleSelectionLayerProps, ISimpleSelectionLayerState> {
    public static defaultProps = {
        active: true
    };

    private hilightingState: HighlightingState = new HighlightingState();

    constructor(props: ISimpleSelectionLayerProps) {
        super(props);

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
    
    private prepareObjectModel = () => {
        const { selectedElements } = this.state;
        const { mainTextElements } = this.props;


        const elements: CanvasElement[] = [];
        
        mainTextElements.forEach(textElement => {
            if (textElement instanceof TextCanvasElement) {
                this.bindEventHandlers(textElement);

                const simpleBrushElement = simpleBrushPlugin(textElement, selectedElements);

                if (simpleBrushElement && simpleBrushElement.rect) {
                    elements.push(simpleBrushElement);
                }
            }
        });

        return elements;
    };

    private bindEventHandlers = (textElement: TextCanvasElement) => {
        const { active } = this.props;

        if (active) {
            textElement.onMouseDown = this.getCharMouseDownHandler(textElement);
            textElement.onMouseMove = this.getCharMouseMoveHandler(textElement);
            textElement.onMouseUp = this.getCharMouseUpHandler(textElement);
        }
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
