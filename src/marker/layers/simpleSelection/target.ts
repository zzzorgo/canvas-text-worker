import { MouseEventHandler } from 'src/marker/MarkerHihghlight';
import { IDeliveryTarget, IMessage, MessageType } from 'src/message-delivery';

export class SimpleSelectionLayerTarget implements IDeliveryTarget {
    private mouseMoveHandler: MouseEventHandler;
    private mouseDownHandler: MouseEventHandler;
    private mouseUpHandler: MouseEventHandler;

    constructor(mouseMoveHandler: MouseEventHandler, mouseDownHandler: MouseEventHandler, mouseUpHandler: MouseEventHandler) {
        this.mouseMoveHandler = mouseMoveHandler;
        this.mouseDownHandler = mouseDownHandler;
        this.mouseUpHandler = mouseUpHandler;
    }

    public handleMessage(message: IMessage) {
        switch (message.type) {
            case MessageType.mouseMove: {
                this.mouseMoveHandler(message);
                break;
            }
                
            case MessageType.mouseDown: {
                this.mouseDownHandler(message);
                break;
            }
            
            case MessageType.mouseUp: {
                this.mouseUpHandler(message);
                break;
            }
        
            default:
                break;
        }
    }
}
