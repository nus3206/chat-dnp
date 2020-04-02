import React, { Component } from 'react'
import MessageForm from './MessageForm'
import MessageList from './MessageList'
import TwilioChat from 'twilio-chat'

import $ from 'jquery'
import './App.css'

class App extends Component {
 

  constructor(props) {
    super(props)
    this.state = {
      messages: [],
      username: null,
      channel: null,
    }
  }

  componentDidMount = () => {

    this.getToken()
      .then(this.createChatClient)
      .then(this.joinGeneralChannel)
      .then(this.configureChannelEvents)
      .catch((error) => {
        this.addMessage({ body: `Error: ${error.message}` })
      })
  }

  getCreatUser = () =>{
    const { url } = this.props.match;

    let chatuser  = url.split('/');
    if(chatuser[1] =="chatuser"){
      var user_id = chatuser[3];
      var friend_id = chatuser[5];
      var name = user_id;
    }else if(chatuser[1] =="chatroom"){

      var user_id = chatuser[3];
      var name = chatuser[5];

      //this.setState({ channel: chatuser[1] })
      this.setState({ username: name })

    }else if(chatuser[1] =="chatgroup"){
      var user_id = chatuser[3];
      var name = chatuser[5];
      //this.setState({ channel: chatuser[1] })
      this.setState({ username: name })
    }else{
      var name = "";
      console.log("Not User");
    }
    return (name);
  }

  getToken = () => {
    return new Promise((resolve, reject) => {
      this.addMessage({ body: 'Connecting...' })
      var u_name = this.getCreatUser();
      console.log(u_name);

      $.post('/token', {user: u_name}, (token) => {
        console.log(token);
        this.setState({ username: token.identity })
        resolve(token)
      }).fail(() => {
        reject(Error('Failed to connect.'))
      })
/*
      $.getJSON('/token', {user: this.state.username}, (token) => {
        console.log(token);
        //this.setState({ username: token.identity })
        resolve(token)
      }).fail(() => {
        reject(Error('Failed to connect.'))
      })
*/
    })
  }

  createChatClient = (token) => {
    return new Promise((resolve, reject) => {
      resolve(new TwilioChat(token.jwt))
    })
  }

  joinGeneralChannel = (chatClient) => {
    return new Promise((resolve, reject) => {
      chatClient.getSubscribedChannels().then(() => {
        chatClient.getChannelByUniqueName('general').then((channel) => {
          this.addMessage({ body: 'Joining general channel...' })
          this.setState({ channel })

          channel.join().then(() => {
            //console.log(this.state.username)
            this.addMessage({ body: `Joined general channel as ${this.state.username}` })
            window.addEventListener('beforeunload', () => channel.leave())
          }).catch(() => reject(Error('Could not join general channel.')))

          resolve(channel)
        }).catch(() => this.createGeneralChannel(chatClient))
      }).catch(() => reject(Error('Could not get channel list.')))
    })
  }

  createGeneralChannel = (chatClient) => {
    return new Promise((resolve, reject) => {
      this.addMessage({ body: 'Creating general channel...' })
      chatClient
        .createChannel({ uniqueName: 'general', friendlyName: 'General Chat' })
        .then(() => this.joinGeneralChannel(chatClient))
        .catch(() => reject(Error('Could not create general channel.')))
    })
  }

  addMessage = (message) => {
    const messageData = { ...message, me: message.author === this.state.username }
    this.setState({
      messages: [...this.state.messages, messageData],
    })
  }

  handleNewMessage = (text) => {
    if (this.state.channel) {
      this.state.channel.sendMessage(text)
    }
  }

  configureChannelEvents = (channel) => {
    channel.on('messageAdded', ({ author, body }) => {
      this.addMessage({ author, body })
    })

    channel.on('memberJoined', (member) => {
      this.addMessage({ body: `${member.identity} has joined the channel.` })
    })

    channel.on('memberLeft', (member) => {
      this.addMessage({ body: `${member.identity} has left the channel.` })
    })
  }

  render() {
    return (
      <div className="App">
        <MessageList messages={this.state.messages} />
        <MessageForm onMessageSend={this.handleNewMessage} />
      </div>
    )
  }
}

export default App
