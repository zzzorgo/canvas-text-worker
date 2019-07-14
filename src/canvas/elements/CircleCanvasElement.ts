import { CanvasElement, ICanvasParams } from '../CanvasElement';
import { FillStyle } from '../constants';

export class CircleCanvasElement extends CanvasElement {
    public fillStyle: FillStyle = 'transparent';

    public render(canvasParams: ICanvasParams) {
        const { ctx } = canvasParams;

        const startAngle = 0;
        const endAngle = 2 * Math.PI;
        const radius = (this.rect.width > this.rect.height ? this.rect.width : this.rect.height) / 2;
        const centerX = this.rect.x + this.rect.width / 2;
        const centerY = this.rect.y + this.rect.height / 2;

        ctx.save();
            ctx.fillStyle = this.fillStyle;
            ctx.strokeStyle = '#4277c8'
            ctx.lineWidth = 15;
            ctx.beginPath();
                ctx.arc(centerX, centerY, radius - ctx.lineWidth / 2, startAngle, endAngle);
                ctx.save();
                    ctx.shadowColor = '#333333';
                    ctx.shadowBlur = 5;
                    ctx.shadowOffsetX = 2;
                    ctx.shadowOffsetY = 2;
                    ctx.stroke();
                ctx.restore();

            ctx.beginPath();
                ctx.arc(centerX, centerY, radius, startAngle, endAngle);
                ctx.fill();
        ctx.restore();
    }
}
