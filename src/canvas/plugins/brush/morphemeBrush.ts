import * as _ from 'lodash';

import { CanvasElement } from 'src/canvas/CanvasElement';
import { CharCanvasElement } from 'src/canvas/elements/CharCanvasElement';
import { TextCanvasElement } from 'src/canvas/elements/TextCanvasElement';
import { RectCanvasElement } from '../../elements/RectCanvasElement';

class MorphemeSelection {
    public range: number[]
}

export function morphemeBrushPlugin(word: TextCanvasElement, morphemeSelection: MorphemeSelection[] | undefined = []) {
    morphemeSelection.forEach(selection => {
        const selectionStart = _.first(selection.range);
        const selectionEnd = _.last(selection.range);

        const startChar: CanvasElement | undefined = word.children.find(
            child => child instanceof CharCanvasElement && child.index === selectionStart
        );

        const endChar: CanvasElement | undefined = word.children.find(
            child => child instanceof CharCanvasElement && child.index === selectionEnd
        );

        if (endChar && startChar) {
            const highlight = new RectCanvasElement();
            highlight.rect = {
                height: 10,
                width: endChar.rect.x - startChar.rect.x + endChar.rect.width,
                x: startChar.rect.x,
                y: startChar.rect.y + 10
            };

            highlight.fillStyle = 'red';
            highlight.alpha = 0.3;
        
            word.children.push(highlight);
        }
    });

}