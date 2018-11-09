import * as React from 'react';
import { CanvasElement, IPoint } from './CanvasElement';
import { CharCanvasElement } from './CharCanvasElement';
import { TextCanvasElement } from './TextCanvasElement';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const TEXT = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;
const WORD_REG = /([\w\dА-Яа-яёЁ]+)/;
const SPLIT_TEXT_REG = /([^\w\dА-Яа-яёЁ]+)|([\w\dА-Яа-яёЁ]+)/g;

export function simpleTextRender(ctx: CanvasRenderingContext2D, text: string): TextCanvasElement[] {
    const LINE_HEIGHT = 40;
    const TEXT_MARGIN = 10;
    const FONT_SIZE = LINE_HEIGHT - 10;
    const FONT_SETTINGS = `400 normal ${FONT_SIZE}px Arial`;

    ctx.font = FONT_SETTINGS;

    const rawBlocks = text.match(SPLIT_TEXT_REG) || [];
    const blocks: TextCanvasElement[] = [];

    ctx.fillStyle = 'silver';
    ctx.textBaseline = 'bottom';
    rawBlocks.reduce((offset, rawBlock) => {
        const blockWidth = ctx.measureText(rawBlock).width;
        const blockIsTooBig = offset.x + blockWidth >= CANVAS_WIDTH - TEXT_MARGIN;
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
            
            block.chars.push(char);

            return offsetX + charWidth;
        }, offset.x);

        blocks.push(block);
        ctx.fillText(rawBlock, offset.x, offset.y);
        offset.x += blockWidth;

        return offset;
    }, {x: TEXT_MARGIN, y: LINE_HEIGHT});

    return blocks;
}

export function renderMouseMoveFeedback(ctx: CanvasRenderingContext2D, elements: CanvasElement[], pointer: IPoint) {
    const {x, y} = pointer;
    const savedGlobalAlpha = ctx.globalAlpha;

    elements.forEach((element) => {
        if (element.isHit(x, y)) {
            ctx.fillStyle = 'green';
            ctx.globalAlpha = 0.5;
            const { x: rectX, y: rectY, width, height } = element.rect;
            ctx.fillRect(rectX, rectY, width, height);
        }
    });

    ctx.globalAlpha = savedGlobalAlpha;
}

export function clearCanvas(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

interface ICanvasContainerState {
    text: string,
    pointerPosition: IPoint
}

export class CanvasContainer extends React.Component<{}, ICanvasContainerState> {
    private canvas: HTMLCanvasElement | null;
    private ctx: CanvasRenderingContext2D | null;

    constructor(props: {}) {
        super(props);

        this.state = {
            pointerPosition: {
                x: 0,
                y: 0
            },
            text: TEXT
        }
    }
    
    public componentDidMount() {
        if (this.canvas) {
            this.ctx = this.canvas.getContext('2d');
            this.canvas.addEventListener('mousemove', this.canvasMouseMove)
            this.renderOnCanvas(this.ctx);
        }
    }
    
    public componentDidUpdate() {
        this.renderOnCanvas(this.ctx);
    }
    
    public render() {
        return (
            <canvas
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            ref={ref => this.canvas = ref} />
        );
    }

    private canvasMouseMove = (e: MouseEvent) => {
        const { offsetX, offsetY } = e;
        this.setState({pointerPosition: {x: offsetX, y: offsetY}});
    };

    private renderOnCanvas(ctx: CanvasRenderingContext2D | null) {
        const { text, pointerPosition } = this.state;
        if (!ctx) { return; }

        clearCanvas(ctx);
        const elements = simpleTextRender(ctx, text);
        renderMouseMoveFeedback(ctx, elements, pointerPosition);
    }
}