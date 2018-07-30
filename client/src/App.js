import * as R from 'ramda';
import React, { Component } from 'react';
import './App.css';
import { getAPIHost } from './lib/api';
import * as uuidv4 from 'uuid/v4';
import { Message } from './Message';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      channel: 'general',
      messages: [],
      messageText: ''
    };

    this.sendMessage = this.sendMessage.bind(this);
  }

  componentDidMount() {
    const {channel} = this.state;
    this.ws = new WebSocket(`ws://${getAPIHost()}/${channel}`);
    this.ws.onmessage = (event) => {
      console.log(`got`, event);
      this.setState({
        messages: R.concat(this.state.messages, [JSON.parse(event.data)])
      }, () => {
        if (this.latestMessage) {
          this.latestMessage.message.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }

  sendMessage() {
    const { messageText, channel } = this.state;
    const fetch = window.fetch;
    const messageId = uuidv4();
    return fetch(`//${getAPIHost()}/user/123/message/${channel}`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      redirect: 'follow',
      body: JSON.stringify({
        message: messageText,
        messageId: messageId
      })
    });
  }

  renderMessages() {
    const {messages} = this.state;
    return messages.map((message, i) => {
      if (i === messages.length - 1) {
        return <Message message={message} ref={el => {
          this.latestMessage = el
        }} key={message.data.messageId || message.offset}/>
      }
      return <Message message={message} key={message.data.messageId || message.offset} />;
    })
  }

  handleChange(type) {
    return event => this.setState({ [type]: event.target.value })
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
          <input type="text" value={this.state.messageText} onChange={this.handleChange('messageText')} />
          <button type="button" onClick={this.sendMessage}>Send</button>
        </div>
        <p>
          {getAPIHost()}
          {this.state.messageText}
        </p>
      </div>
    );
  }
}

export default App;
