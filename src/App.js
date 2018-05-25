import React, { Component } from 'react';
import { Image } from 'react-bootstrap';
import { sortedUniqBy, reverse } from 'lodash';
import GitHubForkRibbon from 'react-github-fork-ribbon';
import { SocialIcon } from 'react-social-icons';
import './App.css';
import players from './players';


class App extends Component {
  render() {
    return (
      <div className="App">
        <GitHubForkRibbon href="https://github.com/danislu/panini.dups"
          target="_blank"
          position="right">
          Fork me on GitHub
        </GitHubForkRibbon>
        <header className="App-header">
          <img src={"https://store.paniniamerica.net/media/catalog/category/WC-coming-soon-web-banner.jpg"} className="App-logo" alt="logo" />
          <h1 className="App-title">Mine duplikater</h1>
        </header>

        <div className="wrapper">
          {
            reverse(sortedUniqBy(players, a => a.name)).map(({ name, url }) => 
            <div className="item">
              <Image className="image" src={url} alt={name} thumbnail />
              <h4>{name}</h4>
            </div>
            )
          }
        </div>
        <footer className="App-header">
          <div className="some">
            <SocialIcon className="someItem" url="mailto:danislu@gmail.com" />
            <SocialIcon className="someItem" url="http://twitter.com/danislu" />
            <SocialIcon className="someItem" url="http://github.com/danislu" />
          </div>
        </footer>
      </div>
    );
  }
}

export default App;
