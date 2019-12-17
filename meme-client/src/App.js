import React from 'react';
import axios from 'axios';
import Scroller from './Scroller.js';
import Image from './Image.js';
import Header from './Header.js';
import {saveAccountInfo, getAccountInfo} from './library.js';
import './App.css';

export default class App extends React.Component {
    // eslint-disable-next-line
    constructor(props) {
        super(props);
        this.parseAuthorName = this.parseAuthorName.bind(this);
    }

    state = {
        memes: []
    }

    componentDidMount() {
      console.log(process.env.REACT_APP_SERVER_DOMAIN);
      let accountInfo = getAccountInfo();
      
      if (!accountInfo) {
        accountInfo = {
          accountId: 16,
          password: 'Guest',
          username: 'Guest'
        }
        saveAccountInfo(accountInfo);
      }
      
      axios.post(process.env.REACT_APP_SERVER_DOMAIN + `/memePaths`, { accountInfo: accountInfo }).then(res => {
        this.setState({memes: res.data})

      }).catch(err => {
        console.log(err.stack);
      });
    }

    parseAuthorName(path) {
        return 'harold';
    }

    render() {
        return (
            <div className="geneva-font centered blue-theme base-4">
                <Header title="MemeFeed">
                </Header>
                <Scroller>
                    {this.state.memes.map(meme => 
                    <Image link={process.env.REACT_APP_SERVER_DOMAIN + meme.file_name} authorName={this.parseAuthorName(meme)} memeId= {meme.id} key={meme.id} />
                    )}
                </Scroller>

            </div>
        );
    }
}
