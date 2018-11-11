import { CanvasElement, ICanvasParams } from './CanvasElement';
import { TEXT_COLOR } from './constants';
import { fillRect } from './utils/render';

export class CharCanvasElement extends CanvasElement {
    public rawChar: string;
    public index: number;

    public render(canvasParams: ICanvasParams) {
        const { ctx } = canvasParams;

        ctx.fillStyle = TEXT_COLOR;
        ctx.fillText(this.rawChar, this.rect.x, this.rect.y + this.rect.height);

        if (this.isHit) {
            fillRect(ctx, this.rect, 'red', 0.4);
        }
    }
}
