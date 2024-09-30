"use client"

import styles from './login.module.scss';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '@/Components/Header/Header';

const Login = () => {
  const [loginSlideClass, setLoginSlideClass] = useState('slide-in-left');
  const [titleSlideClass, setTitleSlideClass] = useState('slide-in-right'); 

  const router = useRouter();

  useEffect(() => { //Function to have the element columns slide in
    if (!router.isReady) return;
    const handleRouteChangeComplete = () => {
      setLoginSlideClass('slide-in-left'); 
      setTitleSlideClass('slide-in-right'); 
    };
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router.events]);
 
  return(
    <>
      <Header/>
      <div className={styles.loginContainer}>
        <div className={`${styles.loginColumn} ${styles[loginSlideClass]}`}>
          <h2 className={styles.loginTitle}>Login</h2>
          <input className={`${styles.input} ${styles.email}`} placeholder='Email'/>
          <input className={`${styles.input} ${styles.password}`} placeholder='Password'/>
        </div>
        <div className={`${styles.titleColumn} ${styles[titleSlideClass]}`}>
          <div className={styles.vanderbiltStar}></div>
          <h2>Vanderbilt TFT</h2>
        </div>
      </div>
    </>
  )
}

export default Login