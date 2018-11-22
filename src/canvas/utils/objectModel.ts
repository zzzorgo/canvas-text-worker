import { RenderPlugin } from '../CanvasContainer';
import { CanvasElement, ICanvasParams, IPoint } from '../CanvasElement';
import { getFontSetting, MouseEvent, VIEW_PORT_SCALE } from '../constants';
import { CharCanvasElement } from '../elements/CharCanvasElement';
import { TextCanvasElement } from '../elements/TextCanvasElement';

const WORD_REG = /([\w\dА-Яа-яёЁ]+)/;
const SPLIT_TEXT_REG = /([^\w\dА-Яа-яёЁ]+)|([\w\dА-Яа-яёЁ]+)/g;

export interface ITextParams {
    text: string,
    lineHeight: number,
    fontSize: number,
    point: IPoint
}

export function getTextParams(text: string = '', fontSize: number = 12, point: IPoint, lineHeight?: number) {
    return {
        fontSize,
        lineHeight: lineHeight || fontSize * 1.25,
        point,
        text
    };
}

export function getElementsFromText(canvasParams: ICanvasParams, textParams: ITextParams, wordPlugin?: RenderPlugin,  charPlugin?: RenderPlugin): TextCanvasElement[] {
    const lineHeight = textParams.lineHeight * VIEW_PORT_SCALE;
    const TEXT_PADDING = textParams.point.x;
    const fontSize = textParams.fontSize * VIEW_PORT_SCALE;
    const FONT_SETTINGS = getFontSetting(fontSize);
    const { ctx, width: canvasWidth } = canvasParams;
    let globalCharIndex = 0;

    ctx.textBaseline = 'bottom';
    ctx.save();
    ctx.font = FONT_SETTINGS;

    const rawBlocks = textParams.text.match(SPLIT_TEXT_REG) || [];
    const blocks: TextCanvasElement[] = [];

    rawBlocks.reduce((offset, rawBlock, blockIndex) => {
        const blockWidth = ctx.measureText(rawBlock).width;
        const blockIsTooBig = offset.x + blockWidth >= canvasWidth;
        const isWordBlock = WORD_REG.test(rawBlock);
        const shouldBreakLine = blockIsTooBig && isWordBlock;

        if (shouldBreakLine) {
            offset.y += lineHeight; 
            offset.x = TEXT_PADDING;
        } 

        const blockRect = {
            height: lineHeight,
            width: blockWidth,
            x: offset.x,
            y: offset.y - lineHeight
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
                height: lineHeight,
                width: charWidth,
                x: offsetX,
                y: blockRect.y
            };

            char.rect = charRect;
            char.rawChar = rawChar;
            char.index = globalCharIndex + blockCharIndex;
            char.fontSize = fontSize;

            if (charPlugin) {
                charPlugin(char, canvasParams);
            }
            
            block.children.push(char);

            return offsetX + charWidth;
        }, offset.x);

        globalCharIndex += rawBlock.length;
        blocks.push(block);
        offset.x += blockWidth;

        return offset;
    }, {x: TEXT_PADDING, y: lineHeight + textParams.point.y});

    ctx.restore();
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
