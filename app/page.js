"use client"
 
import Header from './components/Header/Header';
import Homepage from "./components/Homepage/Homepage";
import {AppProvider} from "../app/contexts/UserContext"

export default function Home() {
  return (
    <AppProvider>
      <Header/>
      <Homepage />
    </AppProvider>
  );
}
