import { ICanvasParams } from './CanvasContainer';
import { CanvasElement } from './CanvasElement';
import { CharCanvasElement } from './CharCanvasElement';
import { fillRect } from './utils';

export class TextCanvasElement extends CanvasElement {
    public rawText: string;
    public children: CharCanvasElement[] = [];

    public render(canvasParams: ICanvasParams) {
        const { ctx } = canvasParams;
        
        ctx.fillStyle = 'silver';
        ctx.fillText(this.rawText, this.rect.x, this.rect.y + this.rect.height);
        if (this.isHit) {
            fillRect(ctx, this.rect, 'green', 0.4);
        }
    }
}
