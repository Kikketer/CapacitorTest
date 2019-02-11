import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import {IonApp} from '@ionic/react'

class index extends Component {
  static defaultProps = {}

  static displayName = 'index'

  static propTypes = {}

  render () {
    return (
      <IonApp>
        <p>Hello World</p>
      </IonApp>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('root'))
