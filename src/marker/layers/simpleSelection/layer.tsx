// import * as React from 'react';
// import { CanvasContainer } from 'src/canvas/CanvasContainer';
import { IIndexedCanvasElement } from 'src/canvas/CanvasElement';
import { ISubscription } from 'src/message-delivery';
// import { SimpleSelectionMechanics } from './mechanics';

export interface ISimpleSelectionLayerProps {
    mainTextElements: IIndexedCanvasElement[],
    active: boolean,
    subscription: ISubscription,
    selectedElements?: number[]
}

export interface ISimpleSelectionLayerState {
    selectedElements: number[]
}

// export class SimpleSelectionLayer extends React.Component<ISimpleSelectionLayerProps, ISimpleSelectionLayerState> {
//     public static defaultProps = {
//         active: true
//     };
    
//     private mechanics = new SimpleSelectionMechanics(this.setState.bind(this));

//     constructor(props: ISimpleSelectionLayerProps) {
//         super(props);

//         this.state = {
//             selectedElements: [0, 1, 2, 3]
//         }
//     }
    
//     public render() {        
//         return (
//             <CanvasContainer
//                 objectModel={this.mechanics.prepareObjectModel(this.props, this.state)}
//                 mix="canvas-container-layer" />
//             );
//         };
// }
