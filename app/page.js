"use client"
 
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import Header from './components/Header/Header';
import Homepage from "./components/Homepage/Homepage";
import {AppProvider} from "../app/contexts/UserContext"

export default function Home() {
  const [user, setUser] = useState(null)
  const email = Cookies.get('userEmail');
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/users?email=${encodeURIComponent(email)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }
        const data = await response.json();
        setUser(data[0]);
      } catch (err) {
        setError(err.message);
      }
    };

    if (email) {
      fetchUserData();
    }
  }, [email]);



  return (
    <AppProvider>
      <Header user={user}/>
      <Homepage user={user}/>
    </AppProvider>
  );
}
