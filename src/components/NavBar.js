/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import {
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

const NavbarComponent = (props) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => setIsOpen(!isOpen)

  return (
    <div>
      <Navbar color="light" light expand="md">
        <NavbarBrand className={styles['navbar-brand']}>
          Nurse Scheduling Problem
        </NavbarBrand>
      </Navbar>
    </div>
  )
}

export default NavbarComponent
