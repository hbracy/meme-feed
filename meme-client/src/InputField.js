import React from 'react';

export default class InputField extends React.Component {
    // eslint-disable-next-line
    constructor(props) {
        super(props);
    }
    render() {
      return (
        <div>
          <label htmlFor={this.props.label}>
              <b>{this.props.label}</b>
          </label>
          <input id="email-input" onChange={this.props.onChangeValue} type="text" placeholder={"Enter " + this.props.label} name={this.props.label} required autoComplete="username" />
        </div>
      );
    }
}
