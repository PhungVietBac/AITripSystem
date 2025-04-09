// src/app/components/header.tsx
"use client";
import styles from './header.module.css';
import Image from "next/image";
import Link from 'next/link';
import { useState } from "react";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Trạng thái dropdown cho mobile

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className={styles.entireWeb}>
      <header className={styles.navbar}>
        <div id={styles.leftbox}>
          <div id={styles.logo1}>
            <Link href="/">
              <Image id={styles.logo2} src="/logo.png" width={30} height={30} alt="logo" />
            </Link>
          </div>
          <div id={styles.label1}>
            <Link href="/">
              <b id={styles.label2}>Tên của trang web</b>
            </Link>
          </div>
        </div>
        <div id={styles.rightbox}>
          <div id={styles.favorite} className={styles.iconWrapper}>
            <Link href="/favorites" className={styles.iconLink}>
              <Image src="/heart.svg" width={30} height={30} alt="favorite" />
              <span className={styles.iconText}><b>Yêu thích</b></span>
            </Link>
          </div>
          <div className={styles.dropdown}>
            <div className={styles.iconLink} onClick={toggleDropdown}>
              <Image src="/hamburger.svg" width={30} height={30} alt="menu" />
              <span className={styles.iconText}><b>Menu</b></span>
            </div>
            <div
              className={`${styles.dropdownContent} ${
                isDropdownOpen ? styles.dropdownContentOpen : ''
              }`}>
              <Link href="/map" onClick={() => setIsDropdownOpen(false)}>
                Bản đồ
              </Link>
              <Link href="/friend" onClick={() => setIsDropdownOpen(false)}>
                Bạn bè
              </Link>
              <Link href="/booking" onClick={() => setIsDropdownOpen(false)}>
                Đặt chỗ
              </Link>
              <Link href="/profile" onClick={() => setIsDropdownOpen(false)}>
                Trang cá nhân
              </Link>
            </div>
          </div>
          <div id={styles.profile} className={styles.iconWrapper}>
            <Link href="/profile" className={styles.iconLink}>
              <Image src="/profile.svg" width={30} height={30} alt="profile" />
              <span className={styles.iconText}><b>Profile</b></span>
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;