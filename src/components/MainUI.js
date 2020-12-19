/* eslint-disable no-unused-vars */
import React, { useState, Component } from 'react'
import {
  Container,
  Row,
  Col,
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
} from 'reactstrap'
import styles from './NavBar.module.css'
import MainGrid from './MainGrid'

const rectStyle = {
  border: '1px solid #333333',
  width: '300px',
  height: '400px',
}

class MainUI extends Component {
  constructor(props) {
    super(props)
    this.MainGridChild = React.createRef()
  }

  render() {
    return (
      <Container className="py-4 mx-4" style={{ maxWidth: 'none' }}>
        <MainGrid ref={this.MainGridChild} {...this.props} />
      </Container>
    )
  }
}

export default MainUI
