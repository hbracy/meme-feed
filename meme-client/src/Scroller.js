import React from 'react';

export default class Scroller extends React.Component {
    // eslint-disable-next-line
    constructor(props) {
        super(props);
    }
    render() {
      return (
        <div className="eighty-percent-width center">
            {this.props.children}
        </div>
      );
    }
}
