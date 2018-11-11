import { CanvasElement, ICanvasParams } from './CanvasElement';
import { fillRect } from './utils/render';

export class HighlightCharCanvasElement extends CanvasElement {
    public render(canvasParams: ICanvasParams) {
        const { ctx } = canvasParams;
        fillRect(ctx, this.rect, 'red', 0.8);
    }
}
