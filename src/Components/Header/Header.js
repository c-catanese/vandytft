"use client";

import React from 'react';
import styles from './Header.module.scss'
import DefaultButton from '../Buttons/DefaultButton/DefaultButton';
import { useRouter } from 'next/navigation';

const Header = () => {
  const router = useRouter();
  
  const rerouteToPage = (page) => {
    // const currentPage = router.pathname;
    // if (currentPage === '/') {
      router.push(page);
    // } else {
    //   setTimeout(() => {
    //     router.push(page);
    //   }, 300);
    // }
  };

  return(
    <header className={styles.headerContainer}>
      <a className={styles.vanderbiltLogo} onClick={() => rerouteToPage('/')}></a>
      <div className={styles.accountNav}>
        <DefaultButton text={'Login'} func={() => rerouteToPage('/auth/login')}/>
        <DefaultButton text={'Sign Up'} func={() => rerouteToPage('/auth/signup')}/>
      </div>
    </header>
  )
}

export default Header