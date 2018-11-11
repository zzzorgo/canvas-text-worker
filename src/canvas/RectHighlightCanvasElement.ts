import { CanvasElement, ICanvasParams } from './CanvasElement';
import { fillRect } from './utils/render';

export class RectHighlightCanvasElement extends CanvasElement {
    public render(canvasParams: ICanvasParams) {
        const { ctx } = canvasParams;
        fillRect(ctx, this.rect, 'yellow', 0.4);
    }
}
