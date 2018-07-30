import React from 'react';

export class Message extends React.Component {
  render() {
    const { message } = this.props;
    return <p ref={el => this.message = el}>{message.data.message + ' ' + message.data.messageId}</p>;
  }
}