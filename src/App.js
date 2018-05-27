import React, { Component } from 'react';
import { Image, Tab, Nav, NavItem, Modal, Button } from 'react-bootstrap';
import { sortedUniqBy, sortBy } from 'lodash';
import { compose } from 'lodash/fp';
import GitHubForkRibbon from 'react-github-fork-ribbon';
import { SocialIcon } from 'react-social-icons';
import './App.css';
import players from './players';

const sortDistinctByName = (array) => sortedUniqBy(array, a => a.name);

const sortByName = list => compose(
  sortDistinctByName,
  array => sortBy(array, a => a.name),
)(list);

const Players = ({ players, onClick }) => (
  <div className="wrapper">
    {
      players.map((player, idx) => {
        const { name, url } = player;
        return (<div key={name} className="item" onClick={() => onClick(idx)}
        >
          <Image className="image" src={url} alt={name} thumbnail />
          <h4>{name}</h4>
        </div>);
      })
    }
  </div>
);

class App extends Component {
  constructor() {
    super();
    this.state = { key: 0 };
  }
  
  render() {
    const duplicates = sortByName(players.duplicates);
    const missing = sortByName(players.missing);
  
    return (
      <div className="App">
        <GitHubForkRibbon href="https://github.com/danislu/panini.dups"
          target="_blank"
          position="right">
          Fork me on GitHub
        </GitHubForkRibbon>
        <header className="App-header">
          <img src={"https://store.paniniamerica.net/media/catalog/category/WC-coming-soon-web-banner.jpg"} className="App-logo" alt="logo" />
          <h1 className="App-title">Panini boken min</h1>
        </header>

        <Tab.Container
          id="left-tabs-example" 
          activeKey={this.state.key}
          onSelect={key => this.setState({ key })}
        >
          <div>
            <Nav bsStyle="pills" justified>
              <NavItem eventKey={0}>Duplikater ({duplicates.length})</NavItem>
              <NavItem eventKey={1}>Mangler ({missing.length})</NavItem>
            </Nav>
            <Tab.Content animation>
              <Tab.Pane eventKey={0}>
                <Players players={duplicates} onClick={(idx) => this.setState({
                  ...this.state,
                  player: duplicates[idx],
                })}/>
              </Tab.Pane>
              <Tab.Pane eventKey={1}>
                <Players players={missing} onClick={(idx) => this.setState({
                  ...this.state,
                  player: missing[idx],
                })}/>
              </Tab.Pane>
            </Tab.Content>
          </div>
        </Tab.Container>

        {
          this.state.player && 
          <Modal show={!!this.state.player} onHide={() => this.setState({
            ...this.state,
            player: undefined,
          })}>
            <Modal.Header closeButton>
              <Modal.Title>{this.state.player.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Image src={this.state.player.url} alt={this.state.player.name} thumbnail />
            </Modal.Body>
          </Modal>
        }
          
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
