"use client"
 
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import Header from "@/Components/Header/Header";
import Homepage from "../Components/Homepage/Homepage";

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
    <>
      <Header user={user}/>
      <Homepage user={user}/>
    </>
  );
}
