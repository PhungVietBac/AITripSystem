import React from 'react'
import Header from "../../components/header";
import styles from './map.module.css'

export default function MapPage() {
    return (
      <div className={styles.body}>
        <Header/>
        <main>
          <h1 className={styles.h1}>Map Page</h1>
          <p className={styles.paragraph}>Đây là trang hiển thị bản đồ và lộ trình.</p>
        </main>
      </div>
    );
  }