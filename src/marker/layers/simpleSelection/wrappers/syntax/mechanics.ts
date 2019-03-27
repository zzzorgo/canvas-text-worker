import { CanvasElement, IIndexedCanvasElement } from 'src/canvas/CanvasElement';
import { TextCanvasElement } from 'src/canvas/elements/TextCanvasElement';
import { predicateBrushPlugin } from 'src/canvas/plugins/brush/syntax/predicateBrush';
import { subjectBrushPlugin } from 'src/canvas/plugins/brush/syntax/subjectBrush';
import { handleElementMouseEvents } from 'src/canvas/utils/objectModel';
import { HighlightingMode } from 'src/marker/HighlightingState';
import { IMouseMessage, MessageType } from 'src/message-delivery';
import { ISimpleSelectionLayerProps } from '../../layer';
import { SimpleSelectionMechanics } from '../../mechanics';
import { ISentenceSyntaxLayerProps, ISentenceSyntaxLayerState } from './layer';

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
    public prepareObjectModel = (props: ISentenceSyntaxLayerProps, state: ISentenceSyntaxLayerState) => {
        
        const { mainTextElements, sentencePart } = props;
        const { pointerPosition, selectedElements } = state;
        const elements: CanvasElement[] = [];

        mainTextElements.forEach(textElement => {
            if (textElement instanceof TextCanvasElement) {
                this.bindEventHandlers(props, state, textElement);

                const brush = this.getConcreteBrush(sentencePart);
                const simpleBrushElement = brush(textElement, selectedElements);

                if (simpleBrushElement && simpleBrushElement.rect) {
                    if (simpleBrushElement.setIsHit(pointerPosition.x, pointerPosition.y)) {
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
                            this.removeSelectedElement(state, textElement);
                        }
                    };

                    elements.push(simpleBrushElement);
                }
            }
        });

        this.selectionElements = elements;

        return elements;
    };

    public handleMouseMessage = (props: ISimpleSelectionLayerProps, state: ISentenceSyntaxLayerState, message: IMouseMessage) => {
        const { active } = props;
        this.setState({ pointerPosition: message.pointerPosition });
        handleElementMouseEvents(message.type, this.selectionElements, message);

        if (message.type === MessageType.mouseUp && active) {
            this.layerMouseUpHandler(state);
        }
    };

    private removeSelectedElement = (state: ISentenceSyntaxLayerState, element: IIndexedCanvasElement) => {
        const { selectedElements } = state;

        this.setState({ selectedElements: selectedElements.filter(index => element.index !== index)});
    };

    private getConcreteBrush(sentencePart: SentenceParts) {
        return PartToBrushMap[sentencePart];
    }
}
