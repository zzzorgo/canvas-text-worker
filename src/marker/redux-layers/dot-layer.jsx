import { prepareDotObjectModel } from './selectors';
import { connect } from 'react-redux';
import { Layer } from './layer';
import { dotClicked } from './actions';

// tslint:disable

const mergeProps = (state, {dispatch}, ownProps) => {
    return {
        ...ownProps,
        objectModel: prepareDotObjectModel(state, {
            mainTextElements: ownProps.mainTextElements,
            clickHandler: wordIndex => dispatch(dotClicked(wordIndex))
        })
    }
};

export const DotLayer = connect(state => state, null, mergeProps)(Layer);
