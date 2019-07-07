import React from 'react';
import { MouseMessageTarget } from 'src/message-delivery/target';
import { CanvasContainer } from 'src/canvas/CanvasContainer';
import { handleElementMouseEvents } from 'src/canvas/utils/objectModel';

export class Layer extends React.Component {
    constructor(props) {
        super(props);

        const target = new MouseMessageTarget(this.handleMouseEvents);
        props.subscription.subscribe(target);
    }

    handleMouseEvents = (message) => {
        handleElementMouseEvents(message.type, this.props.objectModel, message);
    };

    render() {
        return <CanvasContainer {...this.props}/>
    }
}
