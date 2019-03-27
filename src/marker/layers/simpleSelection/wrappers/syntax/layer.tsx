import * as React from 'react';
import { CanvasContainer } from 'src/canvas/CanvasContainer';
import { IPoint } from 'src/canvas/CanvasElement';
import { IMouseMessage } from 'src/message-delivery';
import { MouseMessageTarget } from '../../../../../message-delivery/target';
import { ISimpleSelectionLayerProps, ISimpleSelectionLayerState } from '../../layer';
import { SentenceParts, SentenceSyntaxMechanics } from './mechanics';

export interface ISentenceSyntaxLayerProps extends ISimpleSelectionLayerProps {
    sentencePart: SentenceParts
}

export interface ISentenceSyntaxLayerState extends ISimpleSelectionLayerState {
    pointerPosition: IPoint
}

export class SentenceSyntaxLayer extends React.Component<ISentenceSyntaxLayerProps, ISentenceSyntaxLayerState> {
    private mechanics: SentenceSyntaxMechanics;

    constructor(props: ISentenceSyntaxLayerProps) {
        super(props);

        this.mechanics = new SentenceSyntaxMechanics(this.setState.bind(this));
        const target = new MouseMessageTarget((message: IMouseMessage) => this.mechanics.handleMouseMessage(this.props, this.state, message));

        props.subscription.subscribe(target);

        this.state = {
            selectedElements: [],
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
}

