import { ISetCanvasParamsSizeAction } from './actions';
import { SET_CANVAS_PARAMS_SIZE } from './actionTypes';

export interface ICanvasContaierState {
    ctx?: CanvasRenderingContext2D,
    width: number,
    height: number
}

const initialState = {
    ctx: undefined,
    width: 0,
    height: 0
};

type CanvasContainerAction = ISetCanvasParamsSizeAction;

export const canvasContainerReducer = (state: ICanvasContaierState = initialState, action: CanvasContainerAction) => {
    switch (action.type) {
        case SET_CANVAS_PARAMS_SIZE: {
            const { width, height } = action.size;
            return {
                ...state,
                width,
                height
            };
        }
        default:
            return state;
    }
};
