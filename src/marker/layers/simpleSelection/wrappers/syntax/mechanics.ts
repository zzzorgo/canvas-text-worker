import { CanvasElement, IIndexedCanvasElement, IPoint } from 'src/canvas/CanvasElement';
import { TextCanvasElement } from 'src/canvas/elements/TextCanvasElement';
import { predicateBrushPlugin } from 'src/canvas/plugins/brush/syntax/predicateBrush';
import { subjectBrushPlugin } from 'src/canvas/plugins/brush/syntax/subjectBrush';
import { handleElementMouseEvents } from 'src/canvas/utils/objectModel';
import { HighlightingMode } from 'src/marker/politics';
import { IMouseMessage, MessageType } from 'src/message-delivery';
import { SimpleSelectionMechanics, UpdateSelectedElements } from '../../mechanics';

export enum SentenceParts {
    SUBJECT,
    PREDICATE
}

const PartToBrushMap = {
    [SentenceParts.SUBJECT]: subjectBrushPlugin,
    [SentenceParts.PREDICATE]: predicateBrushPlugin
};

export class SentenceSyntaxMechanics extends SimpleSelectionMechanics {
    public selectionElements: CanvasElement[];
    public sentencePart: SentenceParts;
    public pointerPosition: IPoint

    private updatePointerPosition: any;

    constructor(updateSelectedElements: UpdateSelectedElements, updatePointerPosition: any) {
        super(updateSelectedElements);
        this.updatePointerPosition = updatePointerPosition;
    }

    public prepareObjectModel = (mainTextElements: IIndexedCanvasElement[], selectedElements: number[], active: boolean) => {    
        const elements: CanvasElement[] = [];

        mainTextElements.forEach(textElement => {
            if (textElement instanceof TextCanvasElement) {
                this.bindEventHandlers(selectedElements, textElement, active);

                const brush = this.getConcreteBrush(this.sentencePart);
                const simpleBrushElement = brush(textElement, selectedElements);

                if (simpleBrushElement && simpleBrushElement.rect) {
                    if (simpleBrushElement.setIsHit(this.pointerPosition.x, this.pointerPosition.y)) {
                        simpleBrushElement.alpha = 1;
                        simpleBrushElement.rect = {
                            x: simpleBrushElement.rect.x - 10,
                            y: simpleBrushElement.rect.y - 10,
                            width: simpleBrushElement.rect.width + 20,
                            height: simpleBrushElement.rect.height + 20
                        };
                    }

                    simpleBrushElement.onClick = () => {
                        if (this.hilightingState.mode !== HighlightingMode.ADDING) {
                            this.removeSelectedElement(selectedElements, textElement);
                        }
                    };

                    elements.push(simpleBrushElement);
                }
            }
        });

        this.selectionElements = elements;

        return elements;
    };

    public handleMouseMessage = ( selectedElements: number[], message: IMouseMessage, active: boolean) => {
        this.updatePointerPosition(message.pointerPosition);
        handleElementMouseEvents(message.type, this.selectionElements, message);

        if (message.type === MessageType.mouseUp && active) {
            this.layerMouseUpHandler(selectedElements);
        }
    };

    private removeSelectedElement = (selectedElements: number[], element: IIndexedCanvasElement) => {
        this.updateSelectedElements(selectedElements.filter(index => element.index !== index));
    };

    private getConcreteBrush(sentencePart: SentenceParts) {
        return PartToBrushMap[sentencePart];
    }
}
