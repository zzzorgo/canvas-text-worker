import { CanvasElement, ICanvasParams, IRect } from '../CanvasElement';
import { BACKGROUND_COLOR, FillStyle } from '../constants';

export function fillRect(ctx: CanvasRenderingContext2D, rect: IRect, fillStyle: FillStyle, alpha: number) {
    const {x, y, width, height} = rect;
        ctx.save();
        ctx.fillStyle = fillStyle;
        ctx.globalAlpha = alpha;
        ctx.fillRect(x, y, width, height);
        ctx.restore();
}

export function clearCanvas(canvasParams: ICanvasParams) {
    const { ctx, width: canvasWidth, height: canvasHeight } = canvasParams;

    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}

export function renderWithChildren(canvasParams: ICanvasParams, element: CanvasElement) {
    element.children.forEach(child => renderWithChildren(canvasParams, child));
    element.render(canvasParams);
}
