import * as React from 'react';
import { CanvasElement, IIndexedCanvasElement, IPoint } from 'src/canvas/CanvasElement';
import { TextCanvasElement } from 'src/canvas/elements/TextCanvasElement';
import { underscoreBrushPlugin } from 'src/canvas/plugins/brush';
import { handleElementMouseEvents } from 'src/canvas/utils/objectModel';
import { ISubscriberProps } from 'src/marker/MarkerHihghlight';
import { IMouseMessage } from 'src/message-delivery';
import { MouseMessageTarget } from '../../hover/target';
import { ISimpleSelectionLayerProps, SimpleSelectionLayer } from '../layer';

interface ISentenceSyntaxLayerProps extends ISubscriberProps {
    mainTextElements: TextCanvasElement[],
    active: boolean
}

interface ISentenceSyntaxLayerState {
    hoveredSyntaxElementIndex: number,
    pointerPosition: IPoint
}

export const sentenceSyntaxObjectModelProvider = (SimpleSelectionComponent: React.ComponentType<ISimpleSelectionLayerProps>) => {
    class SentenceSyntaxLayerWrapper extends React.Component<ISentenceSyntaxLayerProps, ISentenceSyntaxLayerState> {
        private selectionElements: CanvasElement[];

        constructor(props: ISentenceSyntaxLayerProps) {
            super(props);

            const target = new MouseMessageTarget(this.handleMouseMessage);
            props.subscription.subscribe(target);

            this.state = {
                hoveredSyntaxElementIndex: -1,
                pointerPosition: {
                    x: 0,
                    y: 0
                }
            };
        }

        public render() {
            return (
                <SimpleSelectionComponent
                    {...this.props}
                    prepareObjectModel={this.prepareObjectModel} />
            );
        }

        private handleMouseMessage = (message: IMouseMessage) => {
            this.setState({ pointerPosition: message.pointerPosition });
            handleElementMouseEvents(message.type, this.selectionElements, message);
        };

        private prepareObjectModel = (
                selectedElements: number[],
                bindEventHandlers: (element: CanvasElement) => void,
                removeSelectedElement: (element: IIndexedCanvasElement) => void) => {
            const { mainTextElements } = this.props;
            const { pointerPosition } = this.state;
            const elements: CanvasElement[] = [];

            mainTextElements.forEach(textElement => {
                if (textElement instanceof TextCanvasElement) {
                    bindEventHandlers(textElement);

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
                            removeSelectedElement(textElement);
                        };

                        elements.push(simpleBrushElement);
                    }
                }
            });

            this.selectionElements = elements;

            return elements;
        }
    }

    return SentenceSyntaxLayerWrapper;
}

export const SentenceSyntaxLayer = sentenceSyntaxObjectModelProvider(SimpleSelectionLayer);
