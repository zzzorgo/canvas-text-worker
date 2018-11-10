import { CanvasElement, ICanvasParams } from './CanvasElement';
import { CharCanvasElement } from './CharCanvasElement';
import { fillRect } from './renderUtils';

export class TextCanvasElement extends CanvasElement {
    public rawText: string;
    public children: CharCanvasElement[] = [];

    public render(canvasParams: ICanvasParams) {
        const { ctx } = canvasParams;
        
        ctx.fillStyle = 'silver';
        if (this.isHit) {
            fillRect(ctx, this.rect, 'green', 0.4);
        }
    }
}
