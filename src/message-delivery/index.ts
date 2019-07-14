import { IPoint } from 'src/canvas/CanvasElement';

export interface IMessage {
    type: MessageType
    propagationStopped?: boolean;
}

export class MouseMessage implements IMessage {
    public type: MessageType
    public pointerPosition: IPoint;
    public propagationStopped?: boolean;

    public stopPropagation = () => {
        this.propagationStopped = true;
    };
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

// tslint:disable-next-line:max-classes-per-file
export class MessageDelivery implements IMessageDelivery {
    private targets: IDeliveryTarget[] = [];

    public subscribe = (target: IDeliveryTarget) => {
        this.targets.unshift(target);
    };

    public dispatchMessage = (message: IMessage) => {
        this.targets.forEach((target) => {
            target.handleMessage(message);
        });
    };
}

export enum MessageType {
    mouseMove = 'onMouseMove',
    mouseEnter = 'onMouseEnter',
    mouseLeave = 'onMouseLeave',
    mouseDown = 'onMouseDown',
    mouseUp = 'onMouseUp',
    mouseClick = 'onClick'
}
