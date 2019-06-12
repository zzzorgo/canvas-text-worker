import * as React from 'react';
import { CanvasContainer } from 'src/canvas/CanvasContainer';
import { IMouseMessage } from 'src/message-delivery';
import { MouseMessageTarget } from '../../../../../message-delivery/target';
import { ISimpleSelectionLayerProps, ISimpleSelectionLayerState } from '../../layer';
import { WordSelectionMechanics } from './machanics';

export class WordSimpleSelectionLayer extends React.Component<ISimpleSelectionLayerProps, ISimpleSelectionLayerState> {
    private mechanics = new WordSelectionMechanics(this.updateSelectedElements.bind(this));

    constructor(props: ISimpleSelectionLayerProps) {
        super(props);

        const target = new MouseMessageTarget(
            (message: IMouseMessage) => this.mechanics.handleMouseMessage(this.state.selectedElements, message, this.props.active)
        );
        props.subscription.subscribe(target);

        this.state = {
            selectedElements: [],
        };
    }

    public render() {        
        const { selectedElements: selectedElementsFromState } = this.state;
        const { active, mainTextElements, selectedElements: selectedElementsFromProps } = this.props;
        const selectedElements = selectedElementsFromProps !== undefined ? selectedElementsFromProps : selectedElementsFromState;

        return (
            <CanvasContainer
                objectModel={this.mechanics.prepareObjectModel(mainTextElements, selectedElements, active)}
                mix="canvas-container-layer" />
            );
    }
    
    private updateSelectedElements(newSelectedElements: number[]) {
        const { selectedElements } = this.state;

        if (selectedElements !== newSelectedElements) {
            this.setState({ selectedElements: newSelectedElements })
        }
    };
}
