"use client";

import React from 'react';
import styles from './Header.module.scss'
import DefaultButton from '../Buttons/DefaultButton/DefaultButton';
import { useRouter } from 'next/navigation';
import { useAppContext } from '../../contexts/UserContext'

const Header = ({ user }) => {
  const router = useRouter();
  const rerouteToPage = (page) => {
    router.push(page);
  };

  const { updateRanks } = useAppContext()


  return(
    <header className={styles.headerContainer}>
      <span className={styles.vanderbiltLogo} onClick={() => rerouteToPage('/')}></span>
      <div className={styles.accountNav} style={user ? { width: '110px' } : {}}      >
          <DefaultButton text={'Update'} func={ updateRanks }/>
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