"use client";

import React from 'react';
import styles from './DefaultButton.module.scss'


const DefaultButton = ({text, func}) => {

  return(
    <button className={styles.buttonDefault} onClick={func}>{text}</button>
  )
}

export default DefaultButton