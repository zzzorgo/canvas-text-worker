import { createSelector } from 'reselect';
import { IState } from 'src';
import { ICanvasContaierState } from '../marker/reducer';
import { ISize } from './CanvasElement';

const getLocalState = (state: IState) : ICanvasContaierState => state.canvasContainer;

export const getCanvasSize: (state: IState) => ISize = createSelector(
    getLocalState, (canvasContainerState) => ({
        width: canvasContainerState.width,
        height: canvasContainerState.height
    })
);
