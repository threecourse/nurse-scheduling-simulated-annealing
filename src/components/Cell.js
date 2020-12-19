// eslint-disable-next-line no-unused-vars
import React, { useState, Component } from 'react'
// import {} from 'reactstrap'
import styles from './Cell.module.css'
import PropTypes from 'prop-types'

class Cell extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    let classes = [styles['cell']]
    for (let cls of this.props.additionalClasses) {
      classes.push(styles[cls])
    }
    if (this.props.isRightEnd) {
      classes.push(styles['is-right-cell'])
    }
    if (this.props.isBottom) {
      classes.push(styles['is-bottom-cell'])
    }
    const style = {
      top: this.props.top,
      left: this.props.left,
      width: this.props.width,
      height: this.props.height,
    }
    return (
      <div
        className={classes.join(' ')}
        style={style}
        onClick={this.props.onClick}
      >
        <div className={styles['inner-cell']}>{this.props.content}</div>
      </div>
    )
  }
}

Cell.defaultProps = {
  onClick: () => {},
  additionalClasses: [],
}

Cell.propTypes = {
  isRightEnd: PropTypes.bool.isRequired,
  isBottom: PropTypes.bool.isRequired,
  top: PropTypes.string.isRequired,
  left: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  content: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  additionalClasses: PropTypes.arrayOf(PropTypes.string),
}

export default Cell
