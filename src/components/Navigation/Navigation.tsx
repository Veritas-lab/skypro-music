"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./navigation.module.css";
import { MouseEventHandler, useState } from "react";
import { useAppSelector } from "@/Store/store";

export default function Navigation() {
  const [burger, setBurger] = useState<string>("none");
  const { isAuth } = useAppSelector((state) => state.auth);

  const hideBurger: MouseEventHandler<HTMLDivElement> = () => {
    setBurger(burger === "inline-block" ? "none" : "inline-block");
  };

  return (
    <nav className={styles.main__nav}>
      <div className={styles.nav__logo}>
        <Link href="/music/main">
          <Image
            width={250}
            height={170}
            className={styles.logo__image}
            src="/img/logo.png"
            alt="logo"
          />
        </Link>
      </div>
      <div className={styles.nav__burger} onClick={hideBurger}>
        <span className={styles.burger__line}></span>
        <span className={styles.burger__line}></span>
        <span className={styles.burger__line}></span>
      </div>
      <div className={styles.nav__menu} style={{ display: burger }}>
        <ul className={styles.menu__list}>
          <li className={styles.menu__item}>
            <Link href="/music/main" className={styles.menu__link}>
              Главное
            </Link>
          </li>
          <li className={styles.menu__item}>
            <Link
              href={isAuth ? "/music/favorites" : "/auth/signin"}
              className={styles.menu__link}
            >
              Мои треки
            </Link>
          </li>
          {!isAuth && (
            <li className={styles.menu__item}>
              <Link href="/auth/signin" className={styles.menu__link}>
                Войти
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
