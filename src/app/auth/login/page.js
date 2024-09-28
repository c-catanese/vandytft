"use client"

import styles from './login.module.scss';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '@/Components/Header/Header';

const Login = () => {
  const [slideClass, setSlideClass] = useState('slide-in'); // Initial state
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    const handleRouteChangeStart = () => {
      setSlideClass('slide-out'); // Trigger slide-out when navigating away
    };

    const handleRouteChangeComplete = () => {
      setSlideClass('slide-in'); // Reset to slide-in when a new route is fully loaded
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router.events]);
 
  return(
    <>
      <Header/>
      <div className={styles.loginContainer}>
        <div className={`${styles.loginColumn} ${styles[slideClass]}`}>
          <h2 className={styles.loginTitle}>Login</h2>
          <input className={styles.emailInput} placeholder='Email'></input>
          <input className={styles.passwordInput} placeholder='Password'></input>
        </div>
        <div className={styles.titleColumn}>
          <div className={styles.vanderbiltStar}></div>
          <h2>Vanderbilt TFT</h2>
        </div>
      </div>
    </>
  )
}

export default Login