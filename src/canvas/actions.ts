import { SET_CANVAS_PARAMS, SET_CANVAS_PARAMS_SIZE } from './actionTypes';
import { ICanvasParams, ISize } from './CanvasElement';

export interface ISetCanvasParamsAction {
    type: typeof SET_CANVAS_PARAMS,
    canvasParams: ICanvasParams
}

export interface ISetCanvasParamsSizeAction {
    type: typeof SET_CANVAS_PARAMS_SIZE,
    size: ISize
}

export const setCanvasParams = (canvasParams: ICanvasParams) : ISetCanvasParamsAction => ({
    type: SET_CANVAS_PARAMS,
    canvasParams
});

export const setCanvasParamsSize = (size: ISize) : ISetCanvasParamsSizeAction => ({
    type: SET_CANVAS_PARAMS_SIZE,
    size
});

