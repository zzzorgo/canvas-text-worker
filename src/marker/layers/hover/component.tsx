import * as React from 'react';
import { CanvasContainer } from 'src/canvas/CanvasContainer';
import { CanvasElement, IPoint } from 'src/canvas/CanvasElement';
import { CharCanvasElement } from 'src/canvas/elements/CharCanvasElement';
import { TextCanvasElement } from 'src/canvas/elements/TextCanvasElement';
import { hoverPlugin } from 'src/canvas/plugins/hover';
import { ISubscriberProps } from 'src/marker/MarkerHihghlight';
import { HoverLayerTarget } from './target';

interface IHoverLayerProps extends ISubscriberProps {
    mainTextElements: TextCanvasElement[]
}

interface IHoverLayerState {
    pointerPosition: IPoint
}

export class HoverLayer extends React.Component<IHoverLayerProps, IHoverLayerState> {
    constructor(props: IHoverLayerProps) {
        super(props);
        
        const target = new HoverLayerTarget(this.setPointerPosition);
        props.subscription.subscribe(target);
        
        this.state = {
            pointerPosition: { x: -1, y: -1 }
        };
    }

    public render() {
        return (
            <CanvasContainer
                objectModel={this.prepareObjectModel()}
                mix="canvas-container-layer hover-layer"
                onMouseMove={this.setPointerPosition} />
        );
    }

    private prepareObjectModel = () => {
        const { mainTextElements } = this.props;
        const { pointerPosition } = this.state;
        const elements: CanvasElement[] = [];

        mainTextElements.forEach(element => {
            const hoverElement = hoverPlugin(element, pointerPosition, 'black');
            if (hoverElement && hoverElement.rect) {
                elements.push(hoverElement);
            }

            element.children.forEach(char => {
                if (char instanceof CharCanvasElement) {
                    const hoverCharElement = hoverPlugin(char, pointerPosition, 'black');

                    if (hoverCharElement && hoverCharElement.rect) {
                        elements.push(hoverCharElement);
                    }
                }
            });
        });

        return elements;
    };

    private setPointerPosition = (pointerPosition: IPoint) => {
        this.setState({ pointerPosition });
    }
}
