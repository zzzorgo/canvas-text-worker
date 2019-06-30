import * as React from 'react';
import { CanvasContainer } from 'src/canvas/CanvasContainer';
import { IPoint } from 'src/canvas/CanvasElement';
import { IMouseMessage } from 'src/message-delivery';
import { MouseMessageTarget } from '../../../../../message-delivery/target';
import { ISimpleSelectionLayerProps, ISimpleSelectionLayerState } from '../../layer';
import { SentenceParts, SentenceSyntaxMechanics } from './mechanics';

export interface ISentenceSyntaxLayerProps extends ISimpleSelectionLayerProps {
    sentencePart: SentenceParts,
    selectedElements?: number[]
}

export interface ISentenceSyntaxLayerState extends ISimpleSelectionLayerState {
    pointerPosition: IPoint
}

export class SentenceSyntaxLayer extends React.Component<ISentenceSyntaxLayerProps, ISentenceSyntaxLayerState> {
    private mechanics: SentenceSyntaxMechanics;

    constructor(props: ISentenceSyntaxLayerProps) {
        super(props);

        this.mechanics = new SentenceSyntaxMechanics(this.updateSelectedElements.bind(this), this.updatePointerPosition.bind(this));
        const target = new MouseMessageTarget(
            (message: IMouseMessage) => this.mechanics.handleMouseMessage(this.state.selectedElements, message, this.props.active)
        );

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
        const { selectedElements: selectedElementsFromState, pointerPosition } = this.state;
        const { active, mainTextElements, selectedElements: selectedElementsFromProps, sentencePart } = this.props;
        const selectedElements = selectedElementsFromProps !== undefined ? selectedElementsFromProps : selectedElementsFromState;
        
        this.mechanics.sentencePart = sentencePart;
        this.mechanics.pointerPosition = pointerPosition;

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

    private updatePointerPosition(newPointerPosition: IPoint) {
        this.setState({ pointerPosition: newPointerPosition })
    }
}

