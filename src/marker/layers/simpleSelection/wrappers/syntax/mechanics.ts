import { CanvasElement, IIndexedCanvasElement } from 'src/canvas/CanvasElement';
import { TextCanvasElement } from 'src/canvas/elements/TextCanvasElement';
import { underscoreBrushPlugin } from 'src/canvas/plugins/brush';
import { HighlightingMode } from 'src/marker/HighlightingState';
import { SimpleSelectionMechanics } from '../../mechanics';
import { ISentenceSyntaxLayerProps, ISentenceSyntaxLayerState } from './layer';

export class SentenceSyntaxMechanics extends SimpleSelectionMechanics {
    public selectionElements: CanvasElement[];
    public prepareObjectModel = (props: ISentenceSyntaxLayerProps, state: ISentenceSyntaxLayerState) => {
        
        const { mainTextElements } = props;
        const { pointerPosition, selectedElements } = state;
        const elements: CanvasElement[] = [];

        mainTextElements.forEach(textElement => {
            if (textElement instanceof TextCanvasElement) {
                this.bindEventHandlers(props, state, textElement);

                const simpleBrushElement = underscoreBrushPlugin(textElement, selectedElements);

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

    private removeSelectedElement = (state: ISentenceSyntaxLayerState, element: IIndexedCanvasElement) => {
        const { selectedElements } = state;

        this.setState({ selectedElements: selectedElements.filter(index => element.index !== index)});
    };
}
