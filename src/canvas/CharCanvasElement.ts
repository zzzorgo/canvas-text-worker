import { ICanvasParams } from './CanvasContainer';
import { CanvasElement } from './CanvasElement';
import { fillRect } from './utils';

export class CharCanvasElement extends CanvasElement {
    public rawChar: string;

    public render(canvasParams: ICanvasParams) {
        if (this.isHit) {
            fillRect(canvasParams.ctx, this.rect, 'red', 0.4);
        }
    }
}
