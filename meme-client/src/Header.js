import React from 'react';
import ProfileModule from './ProfileModule.js'

export default class Header extends React.Component {
    // eslint-disable-next-line
    constructor(props) {
        super(props);
        this.state ={profileModuleOn: false};
        this.toggleProfileModuleState = this.toggleProfileModuleState.bind(this);


    }
    toggleProfileModuleState() {
      this.setState(state => ({
        profileModuleOn: !this.state.profileModuleOn
      }));
    }
  
    render() {
      return (
        <div>
          <div className="fixed-header full-width center base-2 white-text ">
            <div className="vertical-center inline-block">
              {this.props.title}
            </div>
            <div className=" scroller-margin hover inline-block float-right large-font" onClick={this.toggleProfileModuleState}>
            &#9759;
            </div>
          </div>
          {this.state.profileModuleOn && <ProfileModule isOn={this.state.profileModuleOn} toggle={this.toggleProfileModuleState} />}
          <div className="header-height" >
          </div>
        </div>
      );
    }
}
