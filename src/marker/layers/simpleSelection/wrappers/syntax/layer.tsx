import * as React from 'react';
import { CanvasContainer } from 'src/canvas/CanvasContainer';
import { IPoint } from 'src/canvas/CanvasElement';
import { TextCanvasElement } from 'src/canvas/elements/TextCanvasElement';
import { handleElementMouseEvents } from 'src/canvas/utils/objectModel';
import { IMouseMessage } from 'src/message-delivery';
import { MouseMessageTarget } from '../../../../../message-delivery/target';
import { ISimpleSelectionLayerProps, ISimpleSelectionLayerState } from '../../layer';
import { SentenceSyntaxMechanics } from './mechanics';

export interface ISentenceSyntaxLayerProps extends ISimpleSelectionLayerProps {
    mainTextElements: TextCanvasElement[],
    active: boolean
}

export interface ISentenceSyntaxLayerState extends ISimpleSelectionLayerState {
    hoveredSyntaxElementIndex: number,
    pointerPosition: IPoint
}

export class SentenceSyntaxLayer extends React.Component<ISentenceSyntaxLayerProps, ISentenceSyntaxLayerState> {
    private mechanics = new SentenceSyntaxMechanics(this.setState.bind(this));

    constructor(props: ISentenceSyntaxLayerProps) {
        super(props);

        const target = new MouseMessageTarget(this.handleMouseMessage);

        props.subscription.subscribe(target);

        this.state = {
            selectedElements: [],
            hoveredSyntaxElementIndex: -1,
            pointerPosition: {
                x: 0,
                y: 0
            }
        };
    }

    public render() {        
        return (
            <CanvasContainer
                objectModel={this.mechanics.prepareObjectModel(this.props, this.state)}
                mix="canvas-container-layer" />
            );
        }

    private handleMouseMessage = (message: IMouseMessage) => {
        this.setState({ pointerPosition: message.pointerPosition });
        handleElementMouseEvents(message.type, this.mechanics.selectionElements, message);

        this.mechanics.handleMouseMessage(this.props, this.state, message)
    };
}

