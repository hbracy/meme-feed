import React from 'react';
import VizSensor from 'react-visibility-sensor';
import axios from 'axios';
import {getAccountInfo} from './library.js';

export default class ScrollerItem extends React.Component {
  // eslint-disable-next-line
  constructor(props) {
    super(props);
    this.sendSeen = this.sendSeen.bind(this);

  }

  sendSeen(isVisible) {
    if (isVisible) {
      const memeId = this.props.memeId ;
      let accountInfo = getAccountInfo();
//      let accountInfo = localStorage.getItem('accountInfo');
//      
//      accountInfo = atob(accountInfo);
//      accountInfo = JSON.parse(accountInfo);
//      if (!accountInfo) {
//        accountInfo = {
//          id: 11
//        }
//      } else {
//        accountInfo = atob(accountInfo);
//        accountInfo = JSON.parse(accountInfo);
//
//      }

      axios.post(process.env.REACT_APP_SERVER_DOMAIN + `/updateMemeVisibility`, { id: memeId, accountId: accountInfo.accountId }).then(res => {
//        console.log(res.data);
      }).catch(err => {
        console.log(err.stack);
      });
    }

  }
    
  render() {
    return (
      <VizSensor partialVisibility={true} delayedCall={true} onChange={(isVisible) => {
        this.sendSeen(isVisible);
      }}>
        <div className="base-1 margin-top curved full-width black-text">
            <div>{this.props.authorName}</div>
            {this.props.children}
        </div>
      </VizSensor>
    );
  }
}
