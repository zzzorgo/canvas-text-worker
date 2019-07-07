import { connect } from 'react-redux';
import { prepareHoverObjectModel } from './selectors';
import { Layer } from './layer';

const mergePropsHover = (state, {dispatch}, ownProps) => {
    return {
        ...ownProps,
        objectModel: prepareHoverObjectModel(state)
    }
};

export const HoverLayer = connect(state => state, null, mergePropsHover)(Layer);
