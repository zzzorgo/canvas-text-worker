import { CanvasElement, ICanvasParams } from './CanvasElement';
import { fillRect } from './renderUtils';

export class CharCanvasElement extends CanvasElement {
    public rawChar: string;

    public render(canvasParams: ICanvasParams) {
        if (this.isHit) {
            fillRect(canvasParams.ctx, this.rect, 'red', 0.4);
        }
    }
}
