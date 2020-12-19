/* eslint-disable no-unused-vars */
import React, { useState, Component } from 'react'
// import {} from 'reactstrap'
import styles from './MainGrid.module.css'
import PropTypes from 'prop-types'
import XorShift from 'xorshift'
import { getRandomSeed } from '../modules/Utility'
import GridStateManager from '../modules/GridStateManager'
import Cell from './Cell'

class MainGrid extends Component {
  constructor(props) {
    super(props)
    this.state = {
      keydown: false,
      H: 8,
      W: 14,
    }

    // basic parameters
    let height1 = 40
    let width1 = 75
    let h1 = 2
    let w1 = 1
    let height2 = 40
    let width2 = 50
    let h2 = 8
    let w2 = 14
    let height3 = 40
    let h3 = 2
    let width3 = 50
    let w3 = 5
    let offset = 15
    // cell
    this.headerHeight = height1
    this.headerWidth = width2
    this.headerH = h1
    this.headerW = w2
    this.indexHeight = height2
    this.indexWidth = width1
    this.indexH = h2
    this.indexW = w1
    this.cellHeight = height2
    this.cellWidth = width2
    this.cellH = h2
    this.cellW = w2
    // shift-result
    this.indexSRHeight = height3
    this.indexSRWidth = width1
    this.indexSRH = h3
    this.indexSRW = w1
    this.cellSRHeight = height3
    this.cellSRWidth = width2
    this.cellSRH = h3
    this.cellSRW = w2
    // nurse-result
    this.headerNRHeight = height1
    this.headerNRWidth = width3
    this.headerNRH = h1
    this.headerNRW = w3
    this.cellNRHeight = height2
    this.cellNRWidth = width3
    this.cellNRH = h2
    this.cellNRW = w3

    this.y0 = 0
    this.x0 = 0
    this.y1 = this.headerHeight * this.headerH + offset
    this.x1 = this.indexWidth * this.indexW + offset
    this.y2 = this.y1 + this.cellHeight * this.cellH + offset
    this.x2 = this.x1 + this.cellWidth * this.cellW + offset

    const manager = new GridStateManager(this.state.H, this.state.W)
    const gridState = manager.gridState
    this.state.gridStateManager = manager
    this.state.gridState = gridState
    this.state.cellValues = gridState.matrix
    this.state.shiftResultValues = gridState.shift_matrix()
    this.state.nurseResultValues = gridState.nurse_matrix()

    // binding
    this.changeCell = this.changeCell.bind(this)
  }

  // trigger methods for gridStateManager
  optimize() {
    const controller = this.props.getControllerFunc()
    const manager = this.state.gridStateManager
    const steps = 1000
    manager.runAsyncAll(steps, (runner) => {
      this.update(manager.gridState)
      this.updateController(manager)
    })
  }
  reset() {
    const manager = this.state.gridStateManager
    manager.reset()
    this.update(manager.gridState)
    this.updateController(manager)
  }
  changeCell(r, c) {
    const controller = this.props.getControllerFunc()
    const manager = this.state.gridStateManager
    manager.changeCell(r, c)

    this.update(manager.gridState)
    this.updateController(manager)
  }

  // process state
  update(gridState) {
    this.setState({
      gridState: gridState,
      cellValues: gridState.matrix,
      shiftResultValues: gridState.shift_matrix(),
      nurseResultValues: gridState.nurse_matrix(),
    })
  }
  updateController(manager) {
    const controller = this.props.getControllerFunc()
    controller.setState({ steps: manager.steps })
  }

  // render
  headerArea() {
    const list = []
    let H = this.headerH
    let W = this.headerW
    let top = this.y0
    let left = this.x1
    let height = this.headerHeight
    let width = this.headerWidth
    let weekdays = ['月', '火', '水', '木', '金', '土', '日']
    let contentSource = (r, c) => {
      if (r === 0) return weekdays[c % weekdays.length]
      else return c + 1
    }
    for (let r = 0; r < H; r++) {
      for (let c = 0; c < W; c++) {
        const props = {
          isRightEnd: c === W - 1,
          isBottom: r === H - 1,
          top: `${top + r * height}px`,
          left: `${left + c * width}px`,
          height: height,
          width: width,
          content: contentSource(r, c).toString(),
          additionalClasses: ['header-cell'],
        }
        const cell = <Cell {...props} key={`cell${r}-${c}`} />
        list.push(cell)
      }
    }
    return list
  }

  indexArea() {
    const list = []
    let H = this.indexH
    let W = this.indexW
    let top = this.y1
    let left = this.x0
    let height = this.indexHeight
    let width = this.indexWidth
    let contentSource = (r, c) => {
      return r + 1
    }
    for (let r = 0; r < H; r++) {
      for (let c = 0; c < W; c++) {
        const props = {
          isRightEnd: c === W - 1,
          isBottom: r === H - 1,
          top: `${top + r * height}px`,
          left: `${left + c * width}px`,
          height: height,
          width: width,
          content: contentSource(r, c).toString(),
          additionalClasses: ['index-cell'],
        }
        const cell = <Cell {...props} key={`cell${r}-${c}`} />
        list.push(cell)
      }
    }
    return list
  }

  mainArea() {
    const list = []
    let H = this.cellH
    let W = this.cellW
    let top = this.y1
    let left = this.x1
    let height = this.cellHeight
    let width = this.cellWidth
    let valuesList = ['', 'D', 'N']
    let contentSource = (r, c) => {
      const cellValue = this.state.cellValues[r][c]
      return valuesList[cellValue]
    }
    for (let r = 0; r < H; r++) {
      for (let c = 0; c < W; c++) {
        const props = {
          isRightEnd: c === W - 1,
          isBottom: r === H - 1,
          top: `${top + r * height}px`,
          left: `${left + c * width}px`,
          height: height,
          width: width,
          content: contentSource(r, c),
          additionalClasses: ['main-cell'],
          onClick: () => this.changeCell(r, c),
        }
        const cell = <Cell {...props} key={`cell${r}-${c}`} />
        list.push(cell)
      }
    }
    return list
  }

  indexShiftResultArea() {
    const list = []
    let H = this.indexSRH
    let W = this.indexSRW
    let top = this.y2
    let left = this.x0
    let height = this.indexSRHeight
    let width = this.indexSRWidth
    let conditions = ['日勤', '夜勤']
    let contentSource = (r, c) => {
      return conditions[r]
    }
    for (let r = 0; r < H; r++) {
      for (let c = 0; c < W; c++) {
        const props = {
          isRightEnd: c === W - 1,
          isBottom: r === H - 1,
          top: `${top + r * height}px`,
          left: `${left + c * width}px`,
          height: height,
          width: width,
          content: contentSource(r, c),
          additionalClasses: ['index-cell'],
        }
        const cell = <Cell {...props} key={`cell${r}-${c}`} />
        list.push(cell)
      }
    }
    return list
  }

  cellShiftResultArea() {
    const list = []
    let H = this.cellSRH
    let W = this.cellSRW
    let top = this.y2
    let left = this.x1
    let height = this.cellSRHeight
    let width = this.cellSRWidth
    let contentSource = (r, c) => {
      return this.state.shiftResultValues[r][c]
    }
    let additionalClassesSource = (r, c) => {
      const v = contentSource(r, c)
      if (v === 0) {
        return ['success-cell']
      } else {
        return ['failed-cell']
      }
    }
    for (let r = 0; r < H; r++) {
      for (let c = 0; c < W; c++) {
        const props = {
          isRightEnd: c === W - 1,
          isBottom: r === H - 1,
          top: `${top + r * height}px`,
          left: `${left + c * width}px`,
          height: height,
          width: width,
          content: contentSource(r, c).toString(),
          additionalClasses: additionalClassesSource(r, c),
        }
        const cell = <Cell {...props} key={`cell${r}-${c}`} />
        list.push(cell)
      }
    }
    return list
  }

  headerNurseResultArea() {
    const list = []
    let H = this.headerNRH
    let W = this.headerNRW
    let top = this.y0
    let left = this.x2
    let height = this.headerNRHeight
    let width = this.headerNRWidth
    let conditions = [
      ['条件', '条件', '条件', '条件', '条件'],
      ['１', '２', '３', '４', '５'],
    ]
    let contentSource = (r, c) => {
      return conditions[r][c]
    }
    for (let r = 0; r < H; r++) {
      for (let c = 0; c < W; c++) {
        const props = {
          isRightEnd: c === W - 1,
          isBottom: r === H - 1,
          top: `${top + r * height}px`,
          left: `${left + c * width}px`,
          height: height,
          width: width,
          content: contentSource(r, c),
          additionalClasses: ['header-cell'],
        }
        const cell = <Cell {...props} key={`cell${r}-${c}`} />
        list.push(cell)
      }
    }
    return list
  }

  cellNurseResultArea() {
    const list = []
    let H = this.cellNRH
    let W = this.cellNRW
    let top = this.y1
    let left = this.x2
    let height = this.cellNRHeight
    let width = this.cellNRWidth
    let contentSource = (r, c) => {
      // 転置して出力すること
      return this.state.nurseResultValues[c][r]
    }
    let additionalClassesSource = (r, c) => {
      const v = contentSource(r, c)
      if (v === 0) {
        return ['success-cell']
      } else {
        return ['failed-cell']
      }
    }
    for (let r = 0; r < H; r++) {
      for (let c = 0; c < W; c++) {
        const props = {
          isRightEnd: c === W - 1,
          isBottom: r === H - 1,
          top: `${top + r * height}px`,
          left: `${left + c * width}px`,
          height: height,
          width: width,
          content: contentSource(r, c).toString(),
          additionalClasses: additionalClassesSource(r, c),
        }
        const cell = <Cell {...props} key={`cell${r}-${c}`} />
        list.push(cell)
      }
    }
    return list
  }

  render() {
    return (
      <div className={styles['display-area']}>
        {this.headerArea()}
        {this.indexArea()}
        {this.mainArea()}
        {this.indexShiftResultArea()}
        {this.cellShiftResultArea()}
        {this.headerNurseResultArea()}
        {this.cellNurseResultArea()}
      </div>
    )
  }
}

MainGrid.propTypes = {
  getControllerFunc: PropTypes.func,
}

export default MainGrid
