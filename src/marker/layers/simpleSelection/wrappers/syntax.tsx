import { CanvasElement, IIndexedCanvasElement } from 'src/canvas/CanvasElement';
import { TextCanvasElement } from 'src/canvas/elements/TextCanvasElement';
import { underscoreBrushPlugin } from 'src/canvas/plugins/brush';
import { handleElementMouseEvents } from 'src/canvas/utils/objectModel';
import { ISubscriberProps } from 'src/marker/MarkerHihghlight';
import { IMouseMessage } from 'src/message-delivery';
import { MouseMessageTarget } from '../../../../message-delivery/target';
import { SimpleSelectionLayer } from '../layer';

interface ISentenceSyntaxLayerProps extends ISubscriberProps {
    mainTextElements: TextCanvasElement[],
    active: boolean
}

export class SentenceSyntaxLayer extends SimpleSelectionLayer {
    private selectionElements: CanvasElement[];

    constructor(props: ISentenceSyntaxLayerProps) {
        super(props);

        const target = new MouseMessageTarget(this.handleMouseMessage);
        props.subscription.subscribe(target);

        this.state = {
            ...this.state,
            hoveredSyntaxElementIndex: -1,
            pointerPosition: {
                x: 0,
                y: 0
            }
        };
    }

    public prepareObjectModel = (selectedElements: number[]) => {
        const { mainTextElements } = this.props;
        const { pointerPosition } = this.state;
        const elements: CanvasElement[] = [];

        mainTextElements.forEach(textElement => {
            if (textElement instanceof TextCanvasElement) {
                this.bindEventHandlers(textElement);

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
                        this.removeSelectedElement(textElement);
                    };

                    elements.push(simpleBrushElement);
                }
            }
        });

        this.selectionElements = elements;

        return elements;
    };

    private removeSelectedElement = (element: IIndexedCanvasElement) => {
        const { selectedElements } = this.state;

        this.setState({ selectedElements: selectedElements.filter(index => element.index !== index)});
    };
    private handleMouseMessage = (message: IMouseMessage) => {
        this.setState({ pointerPosition: message.pointerPosition });
        handleElementMouseEvents(message.type, this.selectionElements, message);
    };
}
