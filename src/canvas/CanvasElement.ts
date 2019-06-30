import { IMouseMessage, MessageType } from 'src/message-delivery';
import { VIEW_PORT_SCALE } from './constants';

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
        const prevIsHit = this.isHit;
        const nextIsHit = this.checkHit(x, y);

        if (!prevIsHit && nextIsHit) {
            this.onMouseEnter({type: MessageType.mouseEnter, pointerPosition: {x, y}});
        } else if (prevIsHit && !nextIsHit) {
            this.onMouseLeave({type: MessageType.mouseLeave, pointerPosition: {x, y}});
        }

        this.isHit = nextIsHit;
        return nextIsHit;
    }

    public getIsHit = () => this.isHit;

    public onClick = (e: IMouseMessage) => {
        return;
    }

    public onMouseDown = (e: IMouseMessage) => {
        return;
    }

    public onMouseUp = (e: IMouseMessage) => {
        return;
    }

    public onMouseMove = (e: IMouseMessage) => {
        return;
    }

    public onMouseEnter = (e: IMouseMessage) => {
        return;
    }

    public onMouseLeave = (e: IMouseMessage) => {
        return;
    }

    public onContextMenu = (e: IMouseMessage) => {
        return;
    }

    public abstract render(canvasParams: ICanvasParams): void;

    private checkHit = (x: number, y: number) => {
        const viewPortX = x * VIEW_PORT_SCALE;
        const viewPortY = y * VIEW_PORT_SCALE;

        const hitArea = this.rect;
        const hitByX = viewPortX > hitArea.x && viewPortX < (hitArea.x + hitArea.width);
        const hitByY = viewPortY > hitArea.y && viewPortY < (hitArea.y + hitArea.height);
        
        return hitByX && hitByY;
    }
}

export interface IIndexedCanvasElement extends CanvasElement {
    index: number
}
