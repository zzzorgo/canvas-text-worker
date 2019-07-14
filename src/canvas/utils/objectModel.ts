import { MouseMessage } from 'src/message-delivery';
import { CanvasElement, ICanvasParams, IPoint } from '../CanvasElement';
import { getFontSetting, VIEW_PORT_SCALE } from '../constants';
import { CharCanvasElement } from '../elements/CharCanvasElement';
import { TextCanvasElement } from '../elements/TextCanvasElement';

const WORD_REG_CHARS = '\\w\\dА-Яа-яёЁ\\-';
const NOT_WORD_REG_CHARS = `^${WORD_REG_CHARS}`;
const WORD_REG_STRING = `[${WORD_REG_CHARS}]+`;
const NOT_WORD_REG_STRING = `[${NOT_WORD_REG_CHARS}]+`
const WORD_REG = new RegExp(WORD_REG_STRING);
const SPLIT_TEXT_REG = new RegExp(`${WORD_REG_STRING}|${NOT_WORD_REG_STRING}`, 'g');
const SENTECE_SYNTAX_LINE_MARGIN = 28; // 40

export interface ITextParams {
    text: string,
    lineHeight: number,
    fontSize: number,
    point: IPoint
}

export class CanvasObjectModel {
    public maxY: number;
    private nodes: CanvasElement[];

    constructor(canvasParams: ICanvasParams, textParams: ITextParams) {
        this.nodes = this.getElementsFromText(canvasParams, textParams);
    }

    // public generateNodes() {}

    public getNodes = () => {
        return this.nodes;
    };

    private getElementsFromText = (canvasParams: ICanvasParams, textParams: ITextParams): TextCanvasElement[] => {
        const lineHeight = textParams.lineHeight * VIEW_PORT_SCALE;
        const TEXT_PADDING = textParams.point.x;
        const fontSize = textParams.fontSize * VIEW_PORT_SCALE;
        const FONT_SETTINGS = getFontSetting(fontSize);
        const { ctx, width: canvasWidth } = canvasParams;
        let globalCharIndex = 0;
    
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
                offset.y += lineHeight + SENTECE_SYNTAX_LINE_MARGIN; 
                offset.x = TEXT_PADDING;
                this.maxY = offset.y + SENTECE_SYNTAX_LINE_MARGIN;
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
    };
}

export function getTextParams(text: string = '', fontSize: number = 12, point: IPoint, lineHeight?: number) {
    return {
        fontSize,
        lineHeight: lineHeight || fontSize * 1.25,
        point,
        text
    };
}

export function handleElementMouseEvents(eventName: string, elements: CanvasElement[], message: MouseMessage) {
    elements.forEach(element => {
        if (message.propagationStopped) {
            return;
        }

        if (element.setIsHit(message.pointerPosition.x, message.pointerPosition.y)) {
            element[eventName](message);
        }

        handleElementMouseEvents(eventName, element.children, message);
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

export function findElements(elements: CanvasElement[], predicate: (element: CanvasElement) => boolean): CanvasElement[] {
    return elements.reduce((acc: CanvasElement[], element) => {
        if (predicate(element)) {
            acc.push(element);
        }

        acc.concat(findElements(element.children, predicate));
        
        return acc;
    }, []);
}
