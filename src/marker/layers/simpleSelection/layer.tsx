import * as React from 'react';
import { CanvasContainer } from 'src/canvas/CanvasContainer';
import { CanvasElement, IIndexedCanvasElement } from 'src/canvas/CanvasElement';
import { CharCanvasElement } from 'src/canvas/elements/CharCanvasElement';
import { TextCanvasElement } from 'src/canvas/elements/TextCanvasElement';
import { HighlightingMode, HighlightingState } from 'src/marker/HighlightingState';

export interface ISimpleSelectionLayerProps {
    mainTextElements: TextCanvasElement[],
    active: boolean,
    prepareObjectModel: (selectedElements: number[], bindEventHandlers: (element: CanvasElement) => void) => CanvasElement[]
}

interface ISimpleSelectionLayerState {
    selectedElements: number[]
}

export class SimpleSelectionLayer extends React.Component<ISimpleSelectionLayerProps, ISimpleSelectionLayerState> {
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
        const { prepareObjectModel } = this.props;
        const { selectedElements } = this.state;

        return (
            <CanvasContainer
                objectModel={prepareObjectModel(selectedElements, this.bindEventHandlers)}
                mix="canvas-container-layer" />
        );
    }

    private bindEventHandlers = (elementToSelect: CharCanvasElement) => {
        const { active } = this.props;

        if (active) {
            elementToSelect.onMouseDown = this.getElementMouseDownHandler(elementToSelect);
            elementToSelect.onMouseMove = this.getElementMouseMoveHandler(elementToSelect);
            elementToSelect.onMouseUp = this.getElementMouseUpHandler(elementToSelect);
        }
    }

    private getElementMouseDownHandler = (element: IIndexedCanvasElement) => () => {
        const { selectedElements } = this.state;
        const alreadyHighlighted = selectedElements.includes(element.index);
    
        this.hilightingState.start = element.index;
        this.hilightingState.mode = alreadyHighlighted ? HighlightingMode.REMOVING : HighlightingMode.ADDING;
    }
    
    private getElementMouseMoveHandler = (element: IIndexedCanvasElement) => () => {
        this.updateHighlightedChars(element);
    };
    
    private getElementMouseUpHandler = (element: IIndexedCanvasElement) => () => {
        this.updateHighlightedChars(element);
        this.hilightingState.mode = HighlightingMode.STAND_BY;
    }

    private updateHighlightedChars = (element: IIndexedCanvasElement) => {
        const { selectedElements } = this.state;
        const newSelectedElements = this.hilightingState.getNewHighlightedChars(element.index, selectedElements);

        this.setState({ selectedElements: newSelectedElements });
    };
}
