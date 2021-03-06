import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';
import App from './App';
import './index.css';
import { highlightReducer } from './marker/redux-layers/reducer';
import registerServiceWorker from './registerServiceWorker';

// tslint:disable-next-line:no-empty-interface
export interface IState {
    // canvasContainer: ICanvasContaierState
}

const reducer = combineReducers({
    highlight: highlightReducer
});

// tslint:disable-next-line:no-string-literal
const store = createStore(reducer,  window['__REDUX_DEVTOOLS_EXTENSION__'] && window['__REDUX_DEVTOOLS_EXTENSION__']());

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root') as HTMLElement
);
registerServiceWorker();
