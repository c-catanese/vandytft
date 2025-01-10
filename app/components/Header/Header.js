"use client";

import React from 'react';
import styles from './Header.module.scss'
import DefaultButton from '../Buttons/DefaultButton/DefaultButton';
import { usePathname, useRouter } from 'next/navigation';
import { useAppContext } from '../../contexts/UserContext'
import Cookies from 'js-cookie';


const Header = () => {
  const router = useRouter();
  const rerouteToPage = (page) => {
    router.push(page);
  };

  const { updateRanks, user, setUser } = useAppContext()
  const isRoot = usePathname() === '/'
  const buttonContainer = user 
    ? { width: isRoot ? '170px' : '255px' } 
    : { width: isRoot ? '255px' : '170px' }


  return(
    <header className={styles.headerContainer}>
      <span className={styles.vanderbiltLogo} onClick={() => rerouteToPage('/')}></span>
      <div className={styles.accountNav} style={buttonContainer}      >
         {isRoot && (<DefaultButton text={'Update'} func={ updateRanks }/>)}
        {!user && (
          <>
            <DefaultButton text={'Login'} func={() => rerouteToPage('/auth/login')}/>
            <DefaultButton text={'Sign Up'} func={() => rerouteToPage('/auth/signup')}/>
          </>
        )}
        {user && (
          <>
          <DefaultButton text={'Log Out'} func={() => {
            setUser(null)
            Cookies.remove('userEmail', { secure: false,sameSite: 'strict', })}
          }/>
          </>
        )}
      </div>
    </header>
  )
}

export default Header