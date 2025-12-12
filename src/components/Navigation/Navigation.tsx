"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./navigation.module.css";
import { MouseEventHandler, useState } from "react";

export default function Navigation() {
  const [burger, setBurger] = useState<string>("none");

  const hideBurger: MouseEventHandler<HTMLDivElement> = () => {
    setBurger(burger === "inline-block" ? "none" : "inline-block");
  };
  return (
    <nav className={styles.main__nav}>
      <div className={styles.nav__logo}>
        <Image
          width={250}
          height={170}
          className={styles.logo__image}
          src="/img/logo.png"
          alt={"logo"}
        />
      </div>
      <div className={styles.nav__burger} onClick={hideBurger}>
        <span className={styles.burger__line}></span>
        <span className={styles.burger__line}></span>
        <span className={styles.burger__line}></span>
      </div>
      <div className={styles.nav__menu} style={{ display: burger }}>
        <ul className={styles.menu__list}>
          <li className={styles.menu__item}>
            <Link href="#" className={styles.menu__link}>
              Главное
            </Link>
          </li>
          <li className={styles.menu__item}>
            <Link href="#" className={styles.menu__link}>
              Мой треки
            </Link>
          </li>
          <li className={styles.menu__item}>
            <Link href="../signin.html" className={styles.menu__link}>
              Войти
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
