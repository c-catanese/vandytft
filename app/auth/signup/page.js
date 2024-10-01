"use client"

import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '../../../Components/Header/Header';
import styles from './signup.module.scss';


const SignUp = () => {
  const router = useRouter();

  const [loginSlideClass, setLoginSlideClass] = useState('slide-in-left');
  const [titleSlideClass, setTitleSlideClass] = useState('slide-in-right'); 

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [tagline, setTagline] = useState('#');
  const [gradClass, setGradClass] = useState('');

  const [invalidEmail, setInvalidEmail] = useState(false);
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const createUser = async (userData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!email.endsWith('@vanderbilt.edu') || password.length < 8) {
      if (password.length < 8) {
        setInvalidPassword(true);
      }
      if (!email.endsWith('@vanderbilt.edu')) {
        setInvalidEmail(true);
      }
      setLoading(false);
      return;
    }

    if (email.endsWith('@vanderbilt.edu') && invalidEmail) {
      setInvalidEmail(false);
    }
    if (password.length >= 8 && invalidPassword) {
      setInvalidPassword(false);
    }

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      const result = await response.json();
      setSuccess(result);
      if (response.ok) {
        Cookies.set('userEmail', data.email, {
          expires: 30,
          secure: process.env.NODE_ENV === 'production', 
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

  useEffect(() => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare userData for creation
    const userData = {
      username,      // Added username
      password,      // Added password
      email,         // Added email
      classYear: gradClass, // Assuming gradClass is used for classYear
      tagline: tagline.slice(1),       // Added tagline
    };
  
    await createUser(userData);
  };
  
  
  return (
    <>
      <Header />
      <div className={styles.loginContainer}>
        <div className={`${styles.loginColumn} ${styles[loginSlideClass]}`}>
          <h2 className={styles.loginTitle}>Sign Up</h2>
          <form className={styles.signUpForm} onSubmit={handleSubmit}>
            <input 
              className={`${styles.input} ${styles.email}`} 
              placeholder="Email" 
              type="text" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
            {invalidEmail && (<p className={styles.formError}>You must be using a Vanderbilt email.</p>)}

            <input 
              className={`${styles.input} ${styles.password}`} 
              placeholder="Password" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
            {invalidPassword && (<p className={styles.formError}>Password must be at least 8 characters long.</p>)}

            <div className={styles.usernameContainer}>
              <input 
                className={`${styles.input} ${styles.username}`} 
                placeholder="Username" 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
              />
              <input 
                className={`${styles.input} ${styles.tagline}`} 
                placeholder="Tagline" 
                type="text"  
                maxLength={6} 
                value={tagline} 
                onChange={(e) => handleTaglineChange(e.target.value)} 
                onFocus={(e) => e.target.setSelectionRange(1, 1)} 
              />
            </div>

            <input 
              className={`${styles.input} ${styles.class}`} 
              placeholder="Class (YYYY)" 
              type="number" 
              max={9999} 
              value={gradClass}  
              onChange={(e) => {
                const value = e.target.value;    
                if (value === '' || (/^\d{0,4}$/.test(value) && Number(value) <= 9999)) {
                  setGradClass(value);
                }
              }} 
            />
            <button className={styles.submitButton} type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </button>
            {error && <p className={styles.formError}>{error}</p>}
            {success && <p className={styles.successMessage}>User created successfully!</p>}
          </form>
        </div>
        <div className={`${styles.titleColumn} ${styles[titleSlideClass]}`}>
          <div className={styles.vanderbiltStar}></div>
          <h2 className={styles.title}>Vanderbilt TFT</h2>
        </div>
      </div>
    </>
  );
}

export default SignUp;
