import * as React from 'react';
import { CanvasContainer } from 'src/canvas/CanvasContainer';
import { IMouseMessage } from 'src/message-delivery';
import { MouseMessageTarget } from '../../../../../message-delivery/target';
import { ISimpleSelectionLayerProps, ISimpleSelectionLayerState } from '../../layer';
import { CharSelectionMechanics } from './mechanics';

export class CharSimpleSelectionLayer extends React.Component<ISimpleSelectionLayerProps, ISimpleSelectionLayerState> {
    private mechanics: CharSelectionMechanics;

    constructor(props: ISimpleSelectionLayerProps) {
        super(props);
        this.state = {
            selectedElements: [],
        };

        this.mechanics = new CharSelectionMechanics(this.updateSelectedElements);
        const target = new MouseMessageTarget(
            (message: IMouseMessage) => this.mechanics.handleMouseMessage(this.state.selectedElements, message, this.props.active)
        );
        props.subscription.subscribe(target);
    }

    public render() {  
        const { active, mainTextElements } = this.props;
        const selectedElements = this.getSelectedElemetns();

        return (
            <CanvasContainer
                objectModel={this.mechanics.prepareObjectModel(mainTextElements, selectedElements, active)}
                mix="canvas-container-layer" />
            );
    }

    // todo: переписать когда компонент contoled
    private updateSelectedElements = (newSelectedElements: number[]) => {
        const { selectedElements } = this.state;

        if (selectedElements !== newSelectedElements) {
            this.setState({ selectedElements: newSelectedElements })
        }
    };

    private getSelectedElemetns = () => {
        const { selectedElements: selectedElementsFromState } = this.state;
        const { selectedElements: selectedElementsFromProps } = this.props;

        return selectedElementsFromProps !== undefined ? selectedElementsFromProps : selectedElementsFromState;
    };
}

