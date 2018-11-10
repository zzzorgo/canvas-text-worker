import { IRect } from './CanvasElement';

export function fillRect(ctx: CanvasRenderingContext2D, rect: IRect, fillStyle:  string | CanvasGradient | CanvasPattern, alpha: number) {
    const {x, y, width, height} = rect;
        ctx.save();
        ctx.fillStyle = fillStyle;
        ctx.globalAlpha = alpha;
        ctx.fillRect(x, y, width, height);
        ctx.restore();
}
