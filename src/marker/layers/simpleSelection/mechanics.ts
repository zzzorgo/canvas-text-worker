import { CanvasElement, IIndexedCanvasElement } from 'src/canvas/CanvasElement';
import { HighlightingMode, HighlightingState } from 'src/marker/HighlightingState';
import { IMouseMessage, MessageType } from 'src/message-delivery';
import { ISimpleSelectionLayerProps, ISimpleSelectionLayerState } from './layer';

export class SimpleSelectionMechanics {
    public prepareObjectModel: (props: ISimpleSelectionLayerProps, state: ISimpleSelectionLayerState) => CanvasElement[];
    protected setState: any;
    protected hilightingState = new HighlightingState();
    private lastHoveredElement: IIndexedCanvasElement;

    constructor(bindedSetState: any) {
        this.setState = bindedSetState;
    }

    public stopHighlighting(state: ISimpleSelectionLayerState) {
        this.getElementMouseUpHandler(state, this.lastHoveredElement)();
    }
    
    public handleMouseMessage = (props: ISimpleSelectionLayerProps, state: ISimpleSelectionLayerState, message: IMouseMessage) => {
        const { active } = props;
        
        if (message.type === MessageType.mouseUp && active) {
            this.layerMouseUpHandler(state);
        }
    };
    
    protected bindEventHandlers = (props: ISimpleSelectionLayerProps, state: ISimpleSelectionLayerState, elementToSelect: IIndexedCanvasElement) => {
        const { active } = props;
        
        if (active) {
            elementToSelect.onMouseDown = this.getElementMouseDownHandler(state, elementToSelect);
            elementToSelect.onMouseMove = this.getElementMouseMoveHandler(state, elementToSelect);
            elementToSelect.onMouseUp = this.getElementMouseUpHandler(state, elementToSelect);
        }
    }

    protected layerMouseUpHandler = (state: ISimpleSelectionLayerState) => {
        this.stopHighlighting(state);
    };

    private getElementMouseDownHandler = (state: ISimpleSelectionLayerState, element: IIndexedCanvasElement) => () => {
        const { selectedElements } = state;
        const alreadyHighlighted = selectedElements.includes(element.index);
        
        this.hilightingState.start = element.index;
        this.hilightingState.mode = alreadyHighlighted ? HighlightingMode.REMOVING : HighlightingMode.ADDING;
    }
    
    private getElementMouseMoveHandler = (state: ISimpleSelectionLayerState, element: IIndexedCanvasElement) => () => {       
        this.updateHighlightedElements(state, element);
        this.lastHoveredElement = element;
    };
    
    private getElementMouseUpHandler = (state: ISimpleSelectionLayerState, element: IIndexedCanvasElement) => () => {
        this.updateHighlightedElements(state, element);
        this.hilightingState.mode = HighlightingMode.STAND_BY;
    }

    private updateHighlightedElements = (state: ISimpleSelectionLayerState, element: IIndexedCanvasElement) => {
        const { selectedElements } = state;
        const newSelectedElements = this.hilightingState.getNewHighlightedElements(element.index, selectedElements);

        if (selectedElements !== newSelectedElements) {
            this.setState({ selectedElements: newSelectedElements });
        }
    };
}
