import { ISize } from '../../canvas/CanvasElement';
import { SET_CANVAS_PARAMS_SIZE } from './actionTypes';

export interface ISetCanvasParamsSizeAction {
    type: typeof SET_CANVAS_PARAMS_SIZE,
    size: ISize
}

export const setCanvasParamsSize = (size: ISize) : ISetCanvasParamsSizeAction => ({
    type: SET_CANVAS_PARAMS_SIZE,
    size
});

