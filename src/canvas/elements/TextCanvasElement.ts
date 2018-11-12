import { CanvasElement, ICanvasParams, IIndexedCanvasElement } from '../CanvasElement';

export class TextCanvasElement extends CanvasElement implements IIndexedCanvasElement {
    public rawText: string;
    public children: CanvasElement[] = [];
    public index: number;

    public render(canvasParams: ICanvasParams) {
        return;
    }
}
