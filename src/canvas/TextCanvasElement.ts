import { CanvasElement, ICanvasParams } from './CanvasElement';
import { fillRect } from './utils/render';

export class TextCanvasElement extends CanvasElement {
    public rawText: string;
    public children: CanvasElement[] = [];
    public index: number;

    public render(canvasParams: ICanvasParams) {
        const { ctx } = canvasParams;
        
        if (this.isHit) {
            fillRect(ctx, this.rect, 'black', 0.1);
        }
    }
}
