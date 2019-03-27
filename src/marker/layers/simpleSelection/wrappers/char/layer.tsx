import * as React from 'react';
import { CanvasContainer } from 'src/canvas/CanvasContainer';
import { IMouseMessage } from 'src/message-delivery';
import { MouseMessageTarget } from '../../../../../message-delivery/target';
import { ISimpleSelectionLayerProps, ISimpleSelectionLayerState } from '../../layer';
import { CharSelectionMechanics } from './mechanics';

export class CharSimpleSelectionLayer extends React.Component<ISimpleSelectionLayerProps, ISimpleSelectionLayerState> {
    private mechanics = new CharSelectionMechanics(this.setState.bind(this));

    constructor(props: ISimpleSelectionLayerProps) {
        super(props);

        const target = new MouseMessageTarget((message: IMouseMessage) => this.mechanics.handleMouseMessage(this.props, this.state, message));
        props.subscription.subscribe(target);

        this.state = {
            selectedElements: [],
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

