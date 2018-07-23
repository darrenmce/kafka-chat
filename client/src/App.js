import * as R from 'ramda';
import React, { Component } from 'react';
import './App.css';
import { getAPIHost } from './lib/api';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      messages: []
    };
  }

  componentDidMount() {
    const channel = 'general';
    this.ws = new WebSocket(`ws://${getAPIHost()}/${channel}`);
    this.ws.onmessage = (event) => {
      console.log(`got`, event);
      this.setState({
        messages: R.concat(this.state.messages, [JSON.parse(event.data)])
      }, () => {
        if (this.latestMessage) {
          this.latestMessage.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }

  renderMessages() {
    const {messages} = this.state;
    return messages.map((message, i) => {
      if (i === messages.length - 1) {
        return <p ref={el => {
          this.latestMessage = el
        }} key={message.offset}>{message.data.message}</p>
      }
      return <p key={message.offset}>{message.data.message}</p>;
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <div className="chat-main">
          { this.renderMessages() }
        </div>
        <div className="chat-box">
          <input type="text" />
          <button type="button">Send</button>
        </div>
        <p>
          {getAPIHost()}
        </p>
      </div>
    );
  }
}

export default App;
