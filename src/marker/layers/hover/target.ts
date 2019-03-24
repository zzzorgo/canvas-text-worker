import { MouseEventHandler } from 'src/marker/MarkerHihghlight';
import { IDeliveryTarget, IMessage } from 'src/message-delivery';

export class MouseMessageTarget implements IDeliveryTarget {
    private handler: MouseEventHandler;

    constructor(handler: MouseEventHandler) {
        this.handler = handler;
    }

    public handleMessage(message: IMessage) {
        this.handler(message);
    }
}
