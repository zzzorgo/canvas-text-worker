import { MouseEvent, VIEW_PORT_SCALE } from './constants';

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

export interface ISize {
    width: number;
    height: number;
}

export interface ICanvasParams {
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
}

export abstract class CanvasElement {
    public rect: IRect;
    public children: CanvasElement[] = [];

    protected isHit: boolean;

    public setIsHit = (x: number, y: number) => {
        this.isHit = this.checkHit(x, y)
    }

    public getIsHit = () => this.isHit;

    public onClick = (e: MouseEvent) => {
        return;
    }

    public onMouseDown = (e: MouseEvent) => {
        return;
    }

    public onMouseUp = (e: MouseEvent) => {
        return;
    }

    public onMouseMove = (e: MouseEvent) => {
        return;
    }

    public onContextMenu = (e: MouseEvent) => {
        return;
    }

    public abstract render(canvasParams: ICanvasParams): void;

    private checkHit = (x: number, y: number) => {
        const viewPortX = x * VIEW_PORT_SCALE;
        const viewPortY = y * VIEW_PORT_SCALE;

        const hitArea = this.rect;
        const hitByX = viewPortX > hitArea.x && viewPortX < hitArea.x + hitArea.width;
        const hitByY = viewPortY > hitArea.y && viewPortY < hitArea.y + hitArea.height;
        
        return hitByX && hitByY;
    }
}

export interface IIndexedCanvasElement extends CanvasElement {
    index: number
}
