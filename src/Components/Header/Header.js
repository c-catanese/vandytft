"use client";

import React from 'react';
import styles from './Header.module.scss'
import DefaultButton from '../Buttons/DefaultButton/DefaultButton';
import { useRouter } from 'next/router';

const Header = () => {
  // const router = useRouter();
    
  const rerouteToPage = (page) => {
    // return () => {
    //   router.push(page); // Navigate to the specified page
    // };
  };

  return(
    <header className={styles.headerContainer}>
      <a className={styles.vanderbiltLogo}></a>
      {/* <h1 className={styles.title}>Vanderbilt TFT</h1> */}
      <div className={styles.accountNav}>
        <DefaultButton text={'Login'} func={rerouteToPage('./login')}/>
        <DefaultButton text={'Sign Up'} func={rerouteToPage('./signUp')}/>
      </div>
    </header>
  )
}

export default Header