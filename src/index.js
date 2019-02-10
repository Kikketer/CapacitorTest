/**
 * Chris Weed (chris@workgrid.com)
 * Copyright 2019 Workgrid Software LLC
 */
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Plugins } from '@capacitor/core'
const { CognitoPlugin } = Plugins

class App extends Component {
  constructor() {
    super()
    this.state = {
      status: 'loading...'
    }
  }

  async componentDidMount() {
    await CognitoPlugin.config({
      appClientId: process.env.APP_CLIENT_ID,
      signInRedirectUri: process.env.SIGN_IN_URL,
      signOutRedirectUri: process.env.SIGN_OUT_URL,
      webDomain: process.env.WEB_DOMAIN
    })
    this.setState({ status: `Configured with ${process.env.SIGN_IN_URL}` })
  }

  launchAppFromWeb = () => {
    window.location = process.env.APP_DOMAIN
  }

  signIn = async () => {
    try {
      const resp = await CognitoPlugin.getSession()
      this.setState({ status: `Got token! ${resp.accessToken}` })
    } catch (err) {
      this.setState({
        status: err.message
      })
    }
  }

  signOut = async () => {
    try {
      await CognitoPlugin.signOut()
    } catch (err) {
      this.setState({
        status: err.message
      })
    }
  }

  isSignedIn = async () => {
    try {
      const { isSignedIn } = await CognitoPlugin.isSignedIn()
      this.setState({
        status: `Is signed in? ${isSignedIn}`
      })
    } catch (err) {
      this.setState({
        status: err.message
      })
    }
  }

  render() {
    return (
      <div>
        <p>A test of Cognito and other vital components</p>
        <p>{this.state.status}</p>
        <button onClick={this.signIn}>Sign In</button>
        <button onClick={this.signOut}>Sign out</button>
        <button onClick={this.isSignedIn}>Is signed in??</button>
        <a href={`${process.env.APP_DOMAIN}://signin`}>Launch App from Web</a>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
