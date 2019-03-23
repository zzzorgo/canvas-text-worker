import { IPoint } from 'src/canvas/CanvasElement';

export interface IMessage {
    type: MessageType
}

export interface IMouseMessage extends IMessage {
    pointerPosition: IPoint
} 

export interface IDeliveryTarget {
    handleMessage: (message: IMessage) => void
}

export interface ISubscription {
    subscribe: (target: IDeliveryTarget) => void
}

export interface IMessageDelivery extends ISubscription{
    dispatchMessage: (message: IMessage) => void
}

export class MessageDelivery implements IMessageDelivery {
    private targets = new Set<IDeliveryTarget>();

    public subscribe = (target: IDeliveryTarget) => {
        this.targets.add(target);
    };

    public dispatchMessage = (message: IMessage) => {
        this.targets.forEach((target) => {
            target.handleMessage(message);
        });
    };
}

export enum MessageType {
    mouseMove = 'onMouseMove',
    mouseDown = 'onMouseDown',
    mouseUp = 'onMouseUp'
}
