import React from 'react';
import onClickOutside from "react-onclickoutside";
import axios from 'axios';
import Button from './Button.js'
import InputField from './InputField.js'
import {saveAccountInfo} from './library.js'

class ProfileModule extends React.Component {
    // eslint-disable-next-line
  constructor(props) {
    super(props);
    this.state = {
      loginNotSignup: true,
      usernameValue: '',
      passwordValue1: '',
      passwordValue2: '',
    };
    
    this.toggleLoginSignupButton = this.toggleLoginSignupButton.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleusernameChangeValue = this.handleusernameChangeValue.bind(this); 
    this.handlePassword1ChangeValue = this.handlePassword1ChangeValue.bind(this);
    this.handlePassword2ChangeValue = this.handlePassword2ChangeValue.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
    
  }
  
  handleClickOutside = () => {
    this.props.toggle();
  }
  
  handleusernameChangeValue(e) {
    console.log(e.target.value);
    this.setState({
      usernameValue: e.target.value
    });
  }

  handlePassword1ChangeValue(e) {
    console.log(e.target.value);
    this.setState({
      passwordValue1: e.target.value
    });
  }

  handlePassword2ChangeValue(e) {
    console.log(e.target.value);
    this.setState({
      passwordValue2: e.target.value
    });
  }
  
  handleLogin() {    
    let accountInfo = {
      username: this.state.usernameValue,
      password: this.state.passwordValue1
    }
    let toSendAccountInfo = JSON.stringify(accountInfo);
    
    // Sending the info over the internet. Https means any more encryption is redundant.
    axios.post(process.env.REACT_APP_SERVER_DOMAIN + `/login`, { accountInfo: toSendAccountInfo }).then(res => {
      console.log(res.data);
      
      if (!res.data.status) {
        console.log("CREDENTIALS ARE INVALID");
        return;
      }
      
      // Saving the info to the cache
      accountInfo.accountId = res.data.id;            
      saveAccountInfo(accountInfo);
      window.location.reload();
      
    }).catch(err => {
      console.log(err.stack);
    });

  }

  handleSignup() {
    if (this.state.passwordValue1 !== this.state.passwordValue2) {
      return console.log("NO GOOD");
    }
    
    let accountInfo = {
      username: this.state.usernameValue,
      password: this.state.passwordValue1 
    }
    
    // Saving the info to the cache
    accountInfo = JSON.stringify(accountInfo);
    
    // Sending the info over the internet. Https means any more encryption is redundant.
    axios.post(process.env.REACT_APP_SERVER_DOMAIN + `/signup`, { accountInfo: accountInfo }).then(res => {
      console.log(res.data);
      this.handleLogin();
    }).catch(err => {
      console.log(err.stack);
    });
  }
  
  toggleLoginSignupButton() {
    this.setState(state => ({
      loginNotSignup: !this.state.loginNotSignup
    }));
  }
  
  render() {
    // The below can be simpler via an if else
    return (
      <div >
        <div className="popdown-box padding-top fixed-header right">
          {this.state.loginNotSignup && <InputField label="Username" onChangeValue={this.handleusernameChangeValue} />}
          {this.state.loginNotSignup && <InputField label="Password" onChangeValue={this.handlePassword1ChangeValue} />}
          {this.state.loginNotSignup && <Button onClick={this.handleLogin} color="base-3" label="Login" />}
          {this.state.loginNotSignup && <Button color="base-2" label="Go To Sign Up" onClick={this.toggleLoginSignupButton} />}
          {!this.state.loginNotSignup && <InputField label="Username" onChangeValue={this.handleusernameChangeValue} />}
          {!this.state.loginNotSignup && <InputField label="Password" onChangeValue={this.handlePassword1ChangeValue} />}
          {!this.state.loginNotSignup && <InputField label="Confirm Password" onChangeValue={this.handlePassword2ChangeValue} />}
          {!this.state.loginNotSignup && <Button onClick={this.handleSignup} color="base-3" label="Sign Up" />}
          {!this.state.loginNotSignup && <Button color="base-2" label="Go To Login" onClick={this.toggleLoginSignupButton} />}

        </div>
      </div>
    );
  }
}
export default onClickOutside(ProfileModule);
