import { CanvasElement, ICanvasParams } from './CanvasElement';
import { CharCanvasElement } from './CharCanvasElement';
import { TEXT_COLOR } from './constants';
import { fillRect } from './utils/render';

export class TextCanvasElement extends CanvasElement {
    public rawText: string;
    public children: CharCanvasElement[] = [];

    public render(canvasParams: ICanvasParams) {
        const { ctx } = canvasParams;
        
        ctx.fillStyle = TEXT_COLOR;
        if (this.isHit) {
            fillRect(ctx, this.rect, 'green', 0.4);
        }
    }
}
