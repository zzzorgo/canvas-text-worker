import * as React from 'react';
import { CanvasContainer } from 'src/canvas/CanvasContainer';
import { CanvasElement, IIndexedCanvasElement, IPoint } from 'src/canvas/CanvasElement';
import { HighlightingMode, HighlightingState } from 'src/marker/HighlightingState';
import { ISubscription } from 'src/message-delivery';

export interface ISimpleSelectionLayerProps {
    mainTextElements: IIndexedCanvasElement[],
    active: boolean,
    subscription?: ISubscription
}

interface ISimpleSelectionLayerState {
    selectedElements: number[],
    hoveredSyntaxElementIndex: number,
    pointerPosition: IPoint
}

export class SimpleSelectionLayer extends React.Component<ISimpleSelectionLayerProps, ISimpleSelectionLayerState> {
    public static defaultProps = {
        active: true
    };

    protected prepareObjectModel: (selectedElements: number[]) => CanvasElement[];
    
    private hilightingState: HighlightingState = new HighlightingState();

    constructor(props: ISimpleSelectionLayerProps) {
        super(props);

        this.state = {
            selectedElements: [0, 1, 2, 3],
            hoveredSyntaxElementIndex: -1,
            pointerPosition: {
                x: 0,
                y: 0
            }
        }
    }
    
    public render() {
        const { selectedElements } = this.state;
        
        return (
            <CanvasContainer
                objectModel={this.prepareObjectModel(selectedElements)}
                mix="canvas-container-layer" />
            );
        }
        

    protected bindEventHandlers = (elementToSelect: IIndexedCanvasElement) => {
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
        //tslint:disable
        console.log(1);
        this.hilightingState.mode = alreadyHighlighted ? HighlightingMode.REMOVING : HighlightingMode.ADDING;
    }
    
    private getElementMouseMoveHandler = (element: IIndexedCanvasElement) => () => {       
        this.updateHighlightedElements(element);
    };
    
    private getElementMouseUpHandler = (element: IIndexedCanvasElement) => () => {
        this.updateHighlightedElements(element);
        this.hilightingState.mode = HighlightingMode.STAND_BY;
    }

    private updateHighlightedElements = (element: IIndexedCanvasElement) => {
        const { selectedElements } = this.state;
        const newSelectedElements = this.hilightingState.getNewHighlightedElements(element.index, selectedElements);

        if (selectedElements !== newSelectedElements) {
            this.setState({ selectedElements: newSelectedElements });
        }
    };

    // private layerMouseUpHandler = () => {
    //     console.log(123);
    //     console.log(this.hilightingState);
    //     this.hilightingState.mode = HighlightingMode.STAND_BY;
    // };
}
