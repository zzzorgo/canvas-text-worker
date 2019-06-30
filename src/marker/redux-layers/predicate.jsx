// tslint:disable
import React from 'react';
import { connect } from 'react-redux';
import { CanvasContainer } from 'src/canvas/CanvasContainer';
import { MouseMessageTarget } from 'src/message-delivery/target';
import { selectionClicked } from './actions';
import { handleElementMouseEvents } from 'src/canvas/utils/objectModel';
import { prepareObjectModel, getPredicateObjectModel, getSubjectObjectModel, getCurrentBrush, prepareSyntaxObjectModel } from './selectors';

class Layer extends React.Component {
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

const mergePropsPredicate = (state, {dispatch}, ownProps) => {
    return {
        ...ownProps,
        objectModel: prepareSyntaxObjectModel(state, {
            clickHandler:  (index) => dispatch(selectionClicked(index)),
            mainTextElements: ownProps.mainTextElements
        })
    }
};

const mergePropsSubject = (state, {dispatch}, ownProps) => {
    return {
        ...ownProps,
        objectModel: getSubjectObjectModel(state, {
            clickHandler:  () => {},
            mainTextElements: ownProps.mainTextElements
        })
    }
};

export const PredicateLayer = connect(state => state, null, mergePropsPredicate)(Layer);
export const SubjectLayer = connect(state => state, null, mergePropsSubject)(Layer);
