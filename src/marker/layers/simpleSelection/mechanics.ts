import { CanvasElement, IIndexedCanvasElement } from 'src/canvas/CanvasElement';
import { AllPolitic } from 'src/marker/politics/allPolitic';
import { IMouseMessage, MessageType } from 'src/message-delivery';

export type UpdateSelectedElements = (newSelectedElements: number[]) => void;

export class SimpleSelectionMechanics {
    public prepareObjectModel: (mainTextElements: IIndexedCanvasElement[], selectedElements: number[], active: boolean) => CanvasElement[];
    protected updateSelectedElements: UpdateSelectedElements;
    protected hilightingState = new AllPolitic();
    private lastHoveredElement: IIndexedCanvasElement;

    constructor(updateSelectedElements: UpdateSelectedElements) {
        this.updateSelectedElements = updateSelectedElements;
    }

    public handleMouseMessage = (selectedElements: number[], message: IMouseMessage, active: boolean) => {        
        if (message.type === MessageType.mouseUp && active) {
            this.layerMouseUpHandler(selectedElements);
        }
    };
    
    protected bindEventHandlers = (selectedElements: number[], elementToSelect: IIndexedCanvasElement, active: boolean) => {        
        if (active) {
            elementToSelect.onMouseDown = this.getElementMouseDownHandler(selectedElements, elementToSelect);
            elementToSelect.onMouseMove = this.getElementMouseMoveHandler(selectedElements, elementToSelect);
            elementToSelect.onMouseUp = this.getElementMouseUpHandler(selectedElements, elementToSelect);
        }
    }

    protected layerMouseUpHandler = (selectedElements: number[]) => {
        this.stopHighlighting(selectedElements);
    };

    private stopHighlighting(selectedElements: number[]) {
        this.getElementMouseUpHandler(selectedElements, this.lastHoveredElement)();
    }

    private getElementMouseDownHandler = (selectedElements: number[], element: IIndexedCanvasElement) => () => {
        this.hilightingState.startHighlightRequest(element.index, selectedElements);
    }
    
    private getElementMouseMoveHandler = (selectedElements: number[], element: IIndexedCanvasElement) => () => {       
        const newSelectedElements = this.hilightingState.updateHighlightRequest(element.index, selectedElements);
        this.updateHighlightedElements(selectedElements, newSelectedElements);
        this.lastHoveredElement = element;
    };
    
    private getElementMouseUpHandler = (selectedElements: number[], element: IIndexedCanvasElement) => () => {
        const newSelectedElements = this.hilightingState.stopHighlightRequest(element.index, selectedElements);
        this.updateHighlightedElements(selectedElements, newSelectedElements);
    }

    private updateHighlightedElements = (selectedElements: number[], newSelectedElements: number[]) => {
        if (selectedElements !== newSelectedElements) {
            this.updateSelectedElements(newSelectedElements);
        }
    };
}
