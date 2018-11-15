import { CanvasElement, ICanvasParams, IIndexedCanvasElement } from '../CanvasElement';
import { getFontSetting, TEXT_COLOR } from '../constants';

export class CharCanvasElement extends CanvasElement implements IIndexedCanvasElement {
    public rawChar: string;
    public index: number;
    public fontSize: number;

    public render(canvasParams: ICanvasParams) {
        const { ctx } = canvasParams;

        ctx.save();
        
        ctx.font = getFontSetting(this.fontSize);
        ctx.fillStyle = TEXT_COLOR;
        ctx.fillText(this.rawChar, this.rect.x, this.rect.y + this.rect.height);

        ctx.restore()
    }
}
