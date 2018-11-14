import * as React from 'react';
import './App.css';

import { MarkerHighlight } from './marker/MarkerHihghlight';

class App extends React.Component {
    public render() {
        return (
            <div className="App">
                <MarkerHighlight />
            </div>
        );
    }
}

export default App;
