"use client";

import React from 'react';
import styles from './Header.module.scss'
import DefaultButton from '../Buttons/DefaultButton/DefaultButton';

const Header = () => {
 
  return(
    <header className={styles.headerContainer}>
      <a className={styles.vanderbiltLogo}></a>
      <h1 className={styles.title}>Vanderbilt TFT</h1>
      <div className={styles.accountNav}>
        <DefaultButton text={'Login'} func={() => {console.log('login clicked')}}/>
        <DefaultButton text={'Sign Up'} func={() => {console.log('sign up clicked')}}/>
      </div>
    </header>
  )
}

export default Header