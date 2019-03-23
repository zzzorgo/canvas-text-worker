import { IPoint } from 'src/canvas/CanvasElement';
import { IDeliveryTarget, IMessage, IMouseMessage, MessageType } from 'src/message-delivery';

export class HoverLayerTarget implements IDeliveryTarget {
    private hoverHandler: (pointerPosition: IPoint) => void;

    constructor(hoverHandler: (pointerPosition: IPoint) => void) {
        this.hoverHandler = hoverHandler;
    }

    public handleMessage(message: IMessage) {
        if (message.type === MessageType.mouseMove) {
            const hoverMessage = message as IMouseMessage;
            this.hoverHandler(hoverMessage.pointerPosition);
        }
    }
}