import { ICanvasParams } from "./CanvasContainer";

export interface IPoint {
    x: number,
    y: number
}

export interface IRect {
    x: number;
    y: number;
    width: number;
    height: number;
}

export abstract class CanvasElement {
    public rect: IRect;
    public children: CanvasElement[] = [];

    protected isHit: boolean;

    public setIsHit = (x: number, y: number) => {
        this.isHit = this.checkHit(x, y)
    }

    public abstract render(canvasParams: ICanvasParams): void;

    private checkHit = (x: number, y: number) => {
        const hitArea = this.rect;
        const hitByX = x > hitArea.x && x < hitArea.x + hitArea.width;
        const hitByY = y > hitArea.y && y < hitArea.y + hitArea.height;
        
        return hitByX && hitByY;
    }
}
