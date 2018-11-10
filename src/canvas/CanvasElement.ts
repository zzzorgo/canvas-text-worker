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

export class CanvasElement {
    public rect: IRect;
    public children: CanvasElement[] = [];

    public isHit = (x: number, y: number) => {
        const hitArea = this.rect;
        const hitByX = x > hitArea.x && x < hitArea.x + hitArea.width;
        const hitByY = y > hitArea.y && y < hitArea.y + hitArea.height;
        
        return hitByX && hitByY;
    }
}
