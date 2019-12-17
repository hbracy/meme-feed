import React from 'react';
import ScrollerItem from './ScrollerItem.js'

export default class Image extends React.Component {
    // eslint-disable-next-line
    constructor(props) {
        super(props);
        
    }
    
    render() {
      return (
        <ScrollerItem memeId={this.props.memeId} authorName={this.props.authorName}>
            <img className="ninety-percent-width " src={this.props.link} alt=""/>
        </ScrollerItem>
      );
    }
}
