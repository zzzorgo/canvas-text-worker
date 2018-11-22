import * as React from 'react';
import './App.css';

import { MarkerHighlight } from './marker/MarkerHihghlight';
import { MarkerWordparts } from './marker/MarkerWordpats';

class App extends React.Component {
    public render() {
        return (
            <div className="App">
                <MarkerHighlight />
                <MarkerWordparts />
            </div>
        );
    }
}

export default App;
