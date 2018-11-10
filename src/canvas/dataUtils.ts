import { CanvasElement, ICanvasParams, IPoint } from './CanvasElement';
import { CharCanvasElement } from './CharCanvasElement';
import { TextCanvasElement } from './TextCanvasElement';

export function setHitElements(ctx: CanvasRenderingContext2D, elements: CanvasElement[], pointer: IPoint) {
    const {x, y} = pointer;

    elements.forEach((element) => {
        element.setIsHit(x, y);
        setHitElements(ctx, element.children, pointer);
    });
}

const WORD_REG = /([\w\dА-Яа-яёЁ]+)/;
const SPLIT_TEXT_REG = /([^\w\dА-Яа-яёЁ]+)|([\w\dА-Яа-яёЁ]+)/g;

export function getElementsFromText(canvasParams: ICanvasParams, text: string): TextCanvasElement[] {
    const LINE_HEIGHT = 40;
    const TEXT_MARGIN = 10;
    const FONT_SIZE = LINE_HEIGHT - 10;
    const FONT_SETTINGS = `400 normal ${FONT_SIZE}px Arial`;
    const { ctx, width: canvasWidth } = canvasParams;

    ctx.textBaseline = 'bottom';
    ctx.font = FONT_SETTINGS;

    const rawBlocks = text.match(SPLIT_TEXT_REG) || [];
    const blocks: TextCanvasElement[] = [];

    rawBlocks.reduce((offset, rawBlock) => {
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

        rawBlock.split('').reduce((offsetX, rawChar) => {
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
            
            block.children.push(char);

            return offsetX + charWidth;
        }, offset.x);

        blocks.push(block);
        offset.x += blockWidth;

        return offset;
    }, {x: TEXT_MARGIN, y: LINE_HEIGHT});

    return blocks;
}
