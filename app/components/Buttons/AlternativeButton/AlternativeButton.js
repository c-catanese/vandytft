"use client";

import React from 'react';
import styles from './AlternativeButton.module.scss'

const AlternativeButton = ({text, func}) => {

  return(
    <button className={styles.buttonDefault} onClick={func}>{text}</button>
  )
}

export default AlternativeButton