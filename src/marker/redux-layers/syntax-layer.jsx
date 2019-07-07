import { prepareSyntaxObjectModel } from './selectors';
import { connect } from 'react-redux';
import { Layer } from './layer';

// tslint:disable

const mergePropsSyntax = (state, {dispatch}, ownProps) => {
    return {
        ...ownProps,
        objectModel: prepareSyntaxObjectModel(state, {
            mainTextElements: ownProps.mainTextElements
        })
    }
};

export const SyntaxLayer = connect(state => state, null, mergePropsSyntax)(Layer);
