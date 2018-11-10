import * as React from 'react';
import { CanvasElement, IPoint } from './CanvasElement';
import { CharCanvasElement } from './CharCanvasElement';
import { TextCanvasElement } from './TextCanvasElement';

const INITIAL_CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const TEXT = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Ну и что-то на кириллице***`;
const WORD_REG = /([\w\dА-Яа-яёЁ]+)/;
const SPLIT_TEXT_REG = /([^\w\dА-Яа-яёЁ]+)|([\w\dА-Яа-яёЁ]+)/g;

export interface ICanvasParams {
    ctx: CanvasRenderingContext2D,
    width: number
}

type MouseEvent = React.MouseEvent<HTMLElement>;

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

export function setHitElements(ctx: CanvasRenderingContext2D, elements: CanvasElement[], pointer: IPoint) {
    const {x, y} = pointer;

    elements.forEach((element) => {
        element.setIsHit(x, y);
        setHitElements(ctx, element.children, pointer);
    });
}

export function clearCanvas(canvasParams: ICanvasParams) {
    const { ctx, width: canvasWidth } = canvasParams;

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvasWidth, CANVAS_HEIGHT);
}

function renderWithChildren(canvasParams: ICanvasParams, element: CanvasElement) {
    element.render(canvasParams);
    element.children.forEach(child => renderWithChildren(canvasParams, child));
}

interface ICanvasContainerState {
    text: string,
    pointerPosition: IPoint,
    canvasWidth: number
}

export class CanvasContainer extends React.Component<{}, ICanvasContainerState> {
    private canvas: HTMLCanvasElement | null;
    private ctx: CanvasRenderingContext2D | null;

    constructor(props: {}) {
        super(props);

        this.state = {
            canvasWidth: INITIAL_CANVAS_WIDTH,
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
            this.renderOnCanvas(this.ctx);
        }
    }
    
    public componentDidUpdate() {
        this.renderOnCanvas(this.ctx);
    }
    
    public render() {
        const { canvasWidth } = this.state;
        return (
            <canvas
                onClick={this.handleCanvasClick}
                onMouseMove={this.handleCanvasMouseMove}
                width={canvasWidth}
                height={CANVAS_HEIGHT}
                ref={ref => this.canvas = ref} />
        );
    }

    private handleCanvasClick = (e: MouseEvent) => {
        // this.setState({canvasWidth: this.state.canvasWidth + 10});
    };

    private handleCanvasMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        this.setState({pointerPosition: {x: clientX, y: clientY}});
    };

    private renderOnCanvas(ctx: CanvasRenderingContext2D | null) {
        const { text, pointerPosition, canvasWidth } = this.state;
        if (!ctx) { return; }
        const canvasParams = {ctx, width: canvasWidth};

        clearCanvas(canvasParams);
        const elements = getElementsFromText({ctx, width: canvasWidth}, text);
        
        setHitElements(ctx, elements, pointerPosition);

        elements.forEach(element => {
            renderWithChildren(canvasParams, element);
        });
    }
}