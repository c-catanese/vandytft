"use client";

import React from 'react';
import styles from './header.module.scss'
import DefaultButton from '../buttons/defaultButton/defaultButton';
import { useRouter } from 'next/navigation';

const Header = ({ user }) => {
  const router = useRouter();
  
  const rerouteToPage = (page) => {
    router.push(page);
  };
  
  return(
    <header className={styles.headerContainer}>
      <a className={styles.vanderbiltLogo} onClick={() => rerouteToPage('/')}></a>
      <div className={styles.accountNav}>
        {!user && (
          <>
            <DefaultButton text={'Login'} func={() => rerouteToPage('/auth/login')}/>
            <DefaultButton text={'Sign Up'} func={() => rerouteToPage('/auth/signup')}/>
          </>
        )}
      </div>
    </header>
  )
}

export default Header