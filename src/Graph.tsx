import React, { Component } from 'react';
import { Table } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import { DataManipulator } from './DataManipulator';
import './Graph.css';

interface IProps {
  data: ServerRespond[],
  upperBound: number,
  lowerBound: number,
}

interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void,
}

class Graph extends Component<IProps, {}> {
  table: Table | undefined;

  render() {
    return (
      <div>
        <perspective-viewer></perspective-viewer>
      </div>
    );
  }

  componentDidMount() {
    const elem = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;

    const schema = {
      stock: 'string',
      top_ask_price: 'float',
      top_bid_price: 'float',
      timestamp: 'date',
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }
    if (this.table) {
      elem.load(this.table);
      elem.setAttribute('view', 'y_line');
      elem.setAttribute('column-pivots', '["stock"]');
      elem.setAttribute('row-pivots', '["timestamp"]');
      elem.setAttribute('columns', '["top_ask_price"]');
      elem.setAttribute('aggregates', JSON.stringify({
        stock: 'distinctcount',
        top_ask_price: 'avg',
        top_bid_price: 'avg',
        timestamp: 'distinct count',
      }));
    }
  }

  componentDidUpdate() {
    if (this.table) {
      this.table.update(DataManipulator.generateRow(this.props.data));
      this.checkBounds();
    }
  }

  checkBounds() {
    const elem = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;

    // Assuming you have a method to get the current data from the perspective-viewer
    const currentData = elem.getAttribute('view'); // Update based on actual method to get data

    // Check if the current data exceeds bounds
    if (currentData > this.props.upperBound || currentData < this.props.lowerBound) {
      alert('Alert: Ratio has crossed the defined bounds!');
    }
  }
}

export default Graph;
