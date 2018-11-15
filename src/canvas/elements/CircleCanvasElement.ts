import { CanvasElement, ICanvasParams } from '../CanvasElement';

export class CircleCanvasElement extends CanvasElement {
    public render(canvasParams: ICanvasParams) {
        const { ctx } = canvasParams;

        const startAngle = 0;
        const endAngle = 2 * Math.PI;
        const radius = this.rect.width > this.rect.height ? this.rect.width : this.rect.height;
        const centerX = this.rect.x + this.rect.width/2;
        const centerY = this.rect.y + this.rect.height/2;

        ctx.save();

        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.fill();

        ctx.restore();
    }
}
