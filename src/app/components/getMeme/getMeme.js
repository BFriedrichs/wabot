import React, { Component } from 'react';

class getMeme extends Component {
  constructor(props) {
    super(props);
    this.state = {
      memes: [],
    };
  }

  componentDidMount() {
    fetch('https://www.reddit.com/r/dankmemes/top/.json?limit=25')
    .then(results => {
      return results.json();
    }).then(data => {
      let memes = data.results.map((meme) => {
        return(
          <div key = {meme.results}>
            <img src = {meme.data.children[0].data.url}/>
          </div>
        )
      })
      this.setState({memes: memes});
    })
  }

  render() {
    return (
      <div>
        {this.state.memes};
      </div>  
    )
  }
}