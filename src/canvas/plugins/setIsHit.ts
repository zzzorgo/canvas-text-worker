import { IIndexedCanvasElement, IPoint } from '../CanvasElement';

export function setIsHitPlugin(element: IIndexedCanvasElement, pointerPosition: IPoint) {
    const { x, y } = pointerPosition;
    element.setIsHit(x, y);
};