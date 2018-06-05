import React, { Component } from 'react';
import { Image, Tab, Nav, NavItem, Modal } from 'react-bootstrap';
import { sortBy, groupBy, map, sumBy } from 'lodash';
import { compose } from 'lodash/fp';
import GitHubForkRibbon from 'react-github-fork-ribbon';
import { SocialIcon } from 'react-social-icons';
import './App.css';
import players from './players';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import CopyIcon from './copy';

const mapToPlayer = list => compose(
  array => sortBy(array, a => parseInt(a.name.substring(0,3), 10)),
  array => map(array, ar => ({ ...ar[0], count: ar.length })),
  obj => Object.values(obj),
  array => groupBy(array, a => a.name.substring(0,3)),
  items => items.map(i => players.all.find(p => p.name.substring(0,3) === i))
)(list);

const Players = ({ players, onClick }) => (
  <div className="outerWrapper">
    <div className="copyButton">
      <CopyToClipboard text={players.lenght !== 0 ? players.map(({ name }) => name.substring(0,3)).join(',') : ' ' }
        onCopy={() => console.log('copied')}>
        <button><CopyIcon /></button>
      </CopyToClipboard>
    </div>
    <div className="wrapper">
      {
        players.map((player, idx) => {
          const { name, url, count } = player;
          return (<div key={name} className="item" onClick={() => onClick(idx)}
          >
            <Image className="image" src={url} alt={name} thumbnail />
            <h4>{name}</h4>
            { count > 1 && <h6>{count} stk</h6> }

          </div>);
        })
      }
    </div>
  </div>
);

const existitsIn = items => a => items.length === 0 || items.some(i => i === a);


class App extends Component {
  constructor() {
    super();
    this.state = { key: 0, items: [] };
  }

  render() {
    const { items } = this.state;
    const duplicates = mapToPlayer(players.duplicates.filter(existitsIn(items)));
    const missing = mapToPlayer(players.missing.filter(existitsIn(items)));
  
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
          <h1 className="App-undertitle">03.06.2018</h1>
          <div className="filterBox">
            <textarea rows="2" wrap="hard" placeholder="filter med nummer, csv" onChange={e => {
              const value = e.target.value.trim();
              return this.setState({
                ...this.state,
                items: value === '' ? [] : value.split(',')
              });
            }} />
          </div>
        </header>

        <Tab.Container
          id="left-tabs-example" 
          activeKey={this.state.key}
          onSelect={key => this.setState({ key })}
        >
          <div>
            <Nav bsStyle="pills" justified>
              <NavItem eventKey={0}>Duplikater ({sumBy(duplicates, a => a.count)})</NavItem>
              <NavItem eventKey={1}>Mangler ({sumBy(missing, a => a.count)})</NavItem>
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
