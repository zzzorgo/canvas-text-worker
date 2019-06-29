// tslint:disable:no-console
import React from 'react';
import { connect } from 'react-redux';
import { CanvasContainer } from 'src/canvas/CanvasContainer';
import { prepareObjectModel, prepareObjectModel2 } from './selectors';
import { MouseMessageTarget } from 'src/message-delivery/target';
import { selectionClicked, wordClicked } from './actions';
import { MessageType } from 'src/message-delivery';
import { handleElementMouseEvents } from 'src/canvas/utils/objectModel';

const mapStateToProps = (state, {mainTextElements}) => ({
    objectModel: prepareObjectModel(state, {mainTextElements})
});

export const Layer = connect(mapStateToProps)(CanvasContainer);

class LayerComp extends React.Component {
    constructor(props) {
        super(props);

        const target = new MouseMessageTarget(this.handle);
        props.subscription.subscribe(target);
    }

    handle = (message) => {
        handleElementMouseEvents(message.type, this.props.objectModel, message);
    };

    render() {
        return <CanvasContainer {...this.props}/>
    }
}

const mergeProps = (state, {dispatch}, ownProps) => {
    return {
        ...ownProps,
        objectModel: prepareObjectModel2(state, {
            clickHandler:  (index) => dispatch(selectionClicked(index)),
            mainTextElements: ownProps.mainTextElements
        })
    }
};

export const Layer2 = connect(state => state, null, mergeProps)(LayerComp);
