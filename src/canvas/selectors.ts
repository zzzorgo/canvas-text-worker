import { createSelector } from 'reselect';
import { IState } from 'src';
import { ISize } from './CanvasElement';
import { ICanvasContaierState } from './reducer';

const getLocalState = (state: IState) : ICanvasContaierState => state.canvasContainer;

export const getCanvasSize: (state: IState) => ISize = createSelector(
    getLocalState, (canvasContainerState) => ({
        width: canvasContainerState.width,
        height: canvasContainerState.height
    })
);
