import { MessageType, MouseMessage } from 'src/message-delivery';
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

        const message = new MouseMessage();
        message.pointerPosition = {x, y};

        if (!prevIsHit && nextIsHit) {
            message.type = MessageType.mouseEnter;
            this.onMouseEnter(message);
        } else if (prevIsHit && !nextIsHit) {
            message.type = MessageType.mouseLeave;
            this.onMouseLeave(message);
        }

        this.isHit = nextIsHit;
        return nextIsHit;
    }

    public getIsHit = () => this.isHit;

    public onClick = (e: MouseMessage) => {
        return;
    }

    public onMouseDown = (e: MouseMessage) => {
        return;
    }

    public onMouseUp = (e: MouseMessage) => {
        return;
    }

    public onMouseMove = (e: MouseMessage) => {
        return;
    }

    public onMouseEnter = (e: MouseMessage) => {
        return;
    }

    public onMouseLeave = (e: MouseMessage) => {
        return;
    }

    public onContextMenu = (e: MouseMessage) => {
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
