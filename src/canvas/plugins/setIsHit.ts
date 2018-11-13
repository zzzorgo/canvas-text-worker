import { CanvasElement, IPoint } from '../CanvasElement';

export function setIsHitPlugin(element: CanvasElement, pointerPosition: IPoint) {
    const { x, y } = pointerPosition;
    element.setIsHit(x, y);
};