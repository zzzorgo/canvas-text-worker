import * as React from 'react';
import { CanvasContainer } from 'src/canvas/CanvasContainer';
import { CanvasElement } from 'src/canvas/CanvasElement';
import { CharCanvasElement } from 'src/canvas/elements/CharCanvasElement';
import { TextCanvasElement } from 'src/canvas/elements/TextCanvasElement';
import { simpleBrushPlugin } from 'src/canvas/plugins/brush';
import { HighlightingMode, HighlightingState } from 'src/marker/HighlightingState';

interface ISimpleSelectionLayerProps {
    mainTextElements: TextCanvasElement[]
}

interface ISimpleSelectionLayerState {
    selectedElements: number[]
}

export class SimpleSelectionLayer extends React.Component<ISimpleSelectionLayerProps, ISimpleSelectionLayerState> {
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
            textElement.children.forEach(charElement => {
                if (charElement instanceof CharCanvasElement) {
                    charElement.onMouseDown = this.getCharMouseDownHandler(charElement);
                    charElement.onMouseMove = this.getCharMouseMoveHandler(charElement);
                    charElement.onMouseUp = this.getCharMouseUpHandler(charElement);
                    
                    const simpleBrushElement = simpleBrushPlugin(charElement, selectedElements);

                    if (simpleBrushElement && simpleBrushElement.rect) {
                        elements.push(simpleBrushElement);
                    }
                }
            });
        });

        return elements;
    };

    private getCharMouseDownHandler = (char: CharCanvasElement) => () => {
        const { selectedElements } = this.state;
        const alreadyHighlighted = selectedElements.includes(char.index);
    
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
        const { selectedElements } = this.state;
        const newHighlightedChars = this.hilightingState.getNewHighlightedChars(char.index, selectedElements);

        this.setState({ selectedElements: newHighlightedChars });
    };
}
