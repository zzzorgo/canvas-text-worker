import { RenderPlugin } from '../CanvasContainer';
import { CanvasElement, ICanvasParams, IPoint } from '../CanvasElement';
import { MouseEvent, VIEW_PORT_SCALE } from '../constants';
import { CharCanvasElement } from '../elements/CharCanvasElement';
import { TextCanvasElement } from '../elements/TextCanvasElement';

export function setHitElements(ctx: CanvasRenderingContext2D, elements: CanvasElement[], pointer: IPoint) {
    const {x, y} = pointer;

    elements.forEach((element) => {
        element.setIsHit(x, y);
        setHitElements(ctx, element.children, pointer);
    });
}

const WORD_REG = /([\w\dА-Яа-яёЁ]+)/;
const SPLIT_TEXT_REG = /([^\w\dА-Яа-яёЁ]+)|([\w\dА-Яа-яёЁ]+)/g;

export function getElementsFromText(canvasParams: ICanvasParams, text: string, wordPlugin: RenderPlugin,  charPlugin: RenderPlugin): TextCanvasElement[] {
    const LINE_HEIGHT = 50 * VIEW_PORT_SCALE;
    const TEXT_MARGIN = 10 * VIEW_PORT_SCALE;
    const FONT_SIZE = LINE_HEIGHT / 1.25;
    const FONT_SETTINGS = `100 normal ${FONT_SIZE}px 'Calibri'`;
    const { ctx, width: canvasWidth } = canvasParams;
    let globalCharIndex = 0;

    ctx.textBaseline = 'bottom';
    ctx.font = FONT_SETTINGS;

    const rawBlocks = text.match(SPLIT_TEXT_REG) || [];
    const blocks: TextCanvasElement[] = [];

    rawBlocks.reduce((offset, rawBlock, blockIndex) => {
        const blockWidth = ctx.measureText(rawBlock).width;
        const blockIsTooBig = offset.x + blockWidth >= canvasWidth - TEXT_MARGIN;
        const isWordBlock = WORD_REG.test(rawBlock);
        const shouldBreakLine = blockIsTooBig && isWordBlock;

        if (shouldBreakLine) {
            offset.y += LINE_HEIGHT; 
            offset.x = TEXT_MARGIN;
        } 

        const blockRect = {
            height: LINE_HEIGHT,
            width: blockWidth,
            x: offset.x,
            y: offset.y - LINE_HEIGHT
        };

        const block = new TextCanvasElement();
        block.rect = blockRect,
        block.rawText = rawBlock;
        block.index = blockIndex;
        
        if (wordPlugin) {
            wordPlugin(block);
        }

        rawBlock.split('').reduce((offsetX, rawChar, blockCharIndex) => {
            const char = new CharCanvasElement();
            const charWidth = ctx.measureText(rawChar).width;
            const charRect = {
                height: LINE_HEIGHT,
                width: charWidth,
                x: offsetX,
                y: blockRect.y
            };

            char.rect = charRect;
            char.rawChar = rawChar;
            char.index = globalCharIndex + blockCharIndex;

            if (charPlugin) {
                charPlugin(char);
            }
            
            block.children.push(char);

            return offsetX + charWidth;
        }, offset.x);

        globalCharIndex += rawBlock.length;
        blocks.push(block);
        offset.x += blockWidth;

        return offset;
    }, {x: TEXT_MARGIN, y: LINE_HEIGHT});

    return blocks;
}

export function handleElementMouseEvents(eventName: string, elements: CanvasElement[], e: MouseEvent) {
    elements.forEach(element => {
        if (element.getIsHit()) {
            element[eventName](e);
        }

        handleElementMouseEvents(eventName, element.children, e);
    });
}

export function toggleArrayElement(array: any[], element: any) : any[] {
    if (!array.includes(element)) {
        return [
            ...array,
            element
        ];
    } else {
        return array.filter(oldElement => oldElement !== element);
    }
}
