/* eslint-disable no-unused-vars */
import React, { useState, Component } from 'react'
import PropTypes from 'prop-types'
import { Container, Row, Button, Input, Label, Col } from 'reactstrap'

class Controller extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.state.steps = 0
  }

  render() {
    return (
      <Container className="py-4 mx-4">
        <Row className="my-2" style={{ textAlign: 'left' }}>
          ナーススケジューリング問題を焼きなまし法により
          <br />
          解くプログラムです。
          <br />
          <a href="https://threecourse.hatenablog.com/entry/2020/12/19/192257">
            ブログ
          </a>
          も参照下さい。
        </Row>
        <Row className="my-3" />
        <Row className="my-2 align-items-center">
          <Col xs="auto" className="px-0 mx-1">
            <Button color="secondary" onClick={this.props.resetFunc}>
              Reset
            </Button>
          </Col>
          <Col xs="auto" className="px-0 mx-1">
            <Button color="primary" onClick={this.props.optimizeFunc}>
              Optimize
            </Button>
          </Col>

          <Col xs="1" />
          <Col xs={{ size: 'auto' }} className="px-0 mx-1">
            <Input
              disabled
              id="steps"
              value={this.state.steps}
              placeholder="0"
              style={{ textAlign: 'right', width: '80px' }}
            />
          </Col>
          <Col
            xs={{ size: 'auto' }}
            className="px-2 float-right"
            style={{ textAlign: 'left' }}
          >
            steps
          </Col>
        </Row>
        <Row className="my-2 align-items-center" />
        <Row className="my-3" />
        <Row className="my-2" style={{ textAlign: 'left' }}>
          表記：
        </Row>
        <Row className="my-2" style={{ textAlign: 'left' }}>
          <ul>
            <li>Dは日勤、Nは夜勤を表します</li>
            <li>
              制約の各値は、条件を満たしていないことによる評価関数のマイナスを表します
            </li>
          </ul>
        </Row>
        <Row className="my-2" style={{ textAlign: 'left' }}>
          シフト制約：
        </Row>
        <Row>
          <ul>
            <li>条件1. 各日の日勤人数は2人以上</li>
            <li>条件2. 各日の夜勤人数は2人以上</li>
          </ul>
        </Row>
        <Row className="my-2" style={{ textAlign: 'left' }}>
          ナース制約：
        </Row>
        <Row style={{ textAlign: 'left' }}>
          <ul>
            <li>条件1. 休日は7日以上</li>
            <li>条件2. 週末連休を1回以上確保する</li>
            <li>条件3. 連続勤務は4日まで</li>
            <li>条件4. 夜勤の翌日の日勤は不可</li>
            <li>条件5. 連続夜勤は3日まで</li>
          </ul>
        </Row>
      </Container>
    )
  }
}

Controller.propTypes = {
  resetFunc: PropTypes.func,
  optimizeFunc: PropTypes.func,
}

export default Controller
