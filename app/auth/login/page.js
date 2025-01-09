"use client"

import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import styles from './login.module.scss';
import {AppProvider} from "../../../app/contexts/UserContext"

const Login = () => {
  const [loginSlideClass, setLoginSlideClass] = useState('slide-in-left');
  const [titleSlideClass, setTitleSlideClass] = useState('slide-in-right'); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
  }, [router.events, router.isReady]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const login = async (userData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();
      setSuccess(result);
      if (response.ok) {
        Cookies.set('userEmail', email, {
          expires: 30,
          secure: false,
          sameSite: 'strict',
        });
        router.push('/'); 
      }

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      password,
      email,     
    };
    await login(userData);
  };

  return(
    <AppProvider>
      <Header/>
      <div className={styles.loginContainer}>
        <div className={`${styles.loginColumn} ${styles[loginSlideClass]}`}>
          <h2 className={styles.loginTitle}>Login</h2>
          <form className={styles.signUpForm} onSubmit={handleSubmit}>
            <input className={`${styles.input} ${styles.email}`} value={email} onChange={(e) => setEmail(e.target.value)}  placeholder='Email' type='text'/>
            <input className={`${styles.input} ${styles.password}`} value={password} onChange={(e) => setPassword(e.target.value)}  placeholder='Password' type='password'/>
            {error && <p className={styles.formError}>{error}</p>}
            <button className={styles.submitButton} type="submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
        <div className={`${styles.titleColumn} ${styles[titleSlideClass]}`}>
          <div className={styles.vanderbiltStar}></div>
          <h2 className={styles.title}>Vanderbilt TFT</h2>
        </div>
      </div>
    </AppProvider>
  )
}

export default Login