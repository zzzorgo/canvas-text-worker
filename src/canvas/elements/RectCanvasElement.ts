import { CanvasElement, ICanvasParams } from '../CanvasElement';
import { FillStyle } from '../constants';
import { fillRect } from '../utils/render';

export class RectCanvasElement extends CanvasElement {
    public fillStyle: FillStyle;
    public alpha: number;

    public render(canvasParams: ICanvasParams) {
        const { ctx } = canvasParams;
        fillRect(ctx, this.rect, this.fillStyle, this.alpha);
    }
}
