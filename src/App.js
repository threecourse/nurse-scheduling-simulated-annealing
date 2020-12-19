import './App.css'
import React, { Component } from 'react'
import NavBar from './components/NavBar'
import { Col, Row, Container } from 'reactstrap'
import Controller from './components/Controller'
import MainUI from './components/MainUI'

class App extends Component {
  constructor(props) {
    super(props)
    this.optimize = this.optimize.bind(this)
    this.reset = this.reset.bind(this)
    this.getController = this.getController.bind(this)
    this.MainUIChild = React.createRef()
    this.ControllerChild = React.createRef()
  }

  optimize() {
    this.MainUIChild.current.MainGridChild.current.optimize()
  }

  reset() {
    this.MainUIChild.current.MainGridChild.current.reset()
  }

  getController() {
    return this.ControllerChild.current
  }

  render() {
    return (
      <div className="App">
        <NavBar />
        <Container fluid="true">
          <Row>
            <Col md="3">
              <Controller
                ref={this.ControllerChild}
                optimizeFunc={this.optimize}
                resetFunc={this.reset}
              />
            </Col>
            <Col md="9">
              <MainUI
                ref={this.MainUIChild}
                getControllerFunc={this.getController}
              />
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

export default App
