import { CanvasElement } from './CanvasElement';
import { CharCanvasElement } from './CharCanvasElement';

export class TextCanvasElement extends CanvasElement {
    public rawText: string;
    public children: CharCanvasElement[] = [];
}
