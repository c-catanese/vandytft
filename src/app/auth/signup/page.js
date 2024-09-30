"use client"

import Header from '@/Components/Header/Header';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './signup.module.scss';

const SignUp = () => {
  const router = useRouter();

  const [loginSlideClass, setLoginSlideClass] = useState('slide-in-left');
  const [titleSlideClass, setTitleSlideClass] = useState('slide-in-right'); 

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [tagline, setTagline] = useState('#')
  const [gradClass, setGradClass] = useState('');


  const [invalidEmail, setInvalidEmail] = useState(false);
  const [invalidPassword, setInvalidPassword] = useState(false);


  const handleSignUp = (e) => {
    e.preventDefault();

    if(!email.endsWith('@vanderbilt.edu') || password.length < 8){
      if(password.length < 8){
        setInvalidPassword(true)
      }

      if (!email.endsWith('@vanderbilt.edu')) {
        setInvalidEmail(true);
      }
      return
    }
    if (email.endsWith('@vanderbilt.edu') && invalidEmail) {
      setInvalidEmail(false)
    }
    if(password.length > 7 && invalidEmail){
      setInvalidPassword(false)
    }




    console.log('Email:', email);
    console.log('Password:', password);

  }

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

  const handleTaglineChange = (value) => {
    if (value === '') {
        return;
    }
    if (value.length > 0 && value[0] === '#') {
        setTagline(value); 
    } else {
        setTagline(`#${value}`);
    }  
  };
  
  return(
    <>
      <Header/>
      <div className={styles.loginContainer}>
        <div className={`${styles.loginColumn} ${styles[loginSlideClass]}`}>
          <h2 className={styles.loginTitle}>Sign Up</h2>
          <form className={styles.signUpForm} onSubmit={handleSignUp}>
            <input className={`${styles.input} ${styles.email}`} placeholder="Email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
            {invalidEmail && (<p className={styles.formError}>You must be using a Vanderbilt email.</p>)}

            <input className={`${styles.input} ${styles.password}`} placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            {invalidPassword && (<p className={styles.formError}>Password must be at lease 8 characters long.</p>)}

            <div className={styles.usernameContainer}>
              <input className={`${styles.input} ${styles.username}`} placeholder="Username" type="Text" value={username} onChange={(e) => setUsername(e.target.value)}/>
              <input className={`${styles.input} ${styles.tagline}`} placeholder="Tagline" type="Text"  maxLength={6} value={tagline} onChange={(e) => handleTaglineChange(e.target.value)} onFocus={(e) => e.target.setSelectionRange(1, 1)}/>
            </div>


            <input className={`${styles.input} ${styles.password}`} placeholder="Class (YYYY)" type="Text" maxLength={4} value={gradClass} onChange={(e) => setGradClass(e.target.value)}/>


            <button>Submit</button>
          </form>
        </div>
        <div className={`${styles.titleColumn} ${styles[titleSlideClass]}`}>
          <div className={styles.vanderbiltStar}></div>
          <h2>Vanderbilt TFT</h2>
        </div>
      </div>
    </>
  )
}

export default SignUp