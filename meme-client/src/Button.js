import React from 'react';

export default class Button extends React.Component {
    // eslint-disable-next-line
    constructor(props) {
        super(props);
    }
    render() {
      return (
        <div type={this.props.type} className={"button submit inline bottom " + this.props.color} onClick={this.props.onClick}>
          {this.props.label}
        </div>
      );
    }
}
