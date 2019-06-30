import { IDeliveryTarget, IMessage } from 'src/message-delivery';

export type MouseEventHandler = (message: IMessage) => void;

export class MouseMessageTarget implements IDeliveryTarget {
    private handler: MouseEventHandler;

    constructor(handler: MouseEventHandler) {
        this.handler = handler;
    }

    public handleMessage(message: IMessage) {
        this.handler(message);
    }
}
