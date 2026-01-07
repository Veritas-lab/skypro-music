"use client";

import styles from "./signup.module.css";
import classNames from "classnames";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/Store/store";
import { register, clearError } from "@/Store/Features/authSlice";
import { useRouter } from "next/navigation";

export default function Signup() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { error, loading } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeat, setRepeat] = useState("");

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !email.trim() ||
      !username.trim() ||
      !password.trim() ||
      !repeat.trim()
    ) {
      alert("Заполните все поля");
      return;
    }

    if (password !== repeat) {
      alert("Пароли не совпадают");
      return;
    }

    if (password.length < 6) {
      alert("Пароль должен содержать минимум 6 символов");
      return;
    }

    try {
      const result = await dispatch(register({ email, username, password }));

      if (register.fulfilled.match(result)) {
        alert("Регистрация успешна! Теперь вы можете войти.");
        router.push("/auth/signin");
      }
    } catch (err) {
      console.error("Ошибка регистрации:", err);
    }
  };

  return (
    <div className={styles.modal__block}>
      <Link href="/">
        <div className={styles.modal__logo}>
          <Image
            src="/img/logo_modal.png"
            alt="logo"
            width={140}
            height={21}
            priority
          />
        </div>
      </Link>

      <form onSubmit={handleRegister} className={styles.modal__form}>
        <input
          className={classNames(styles.modal__input, styles.login)}
          type="text"
          placeholder="Имя пользователя"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={loading}
        />

        <input
          className={classNames(styles.modal__input)}
          type="email"
          placeholder="Почта"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />

        <input
          className={classNames(styles.modal__input)}
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
          minLength={6}
        />

        <input
          className={classNames(styles.modal__input)}
          type="password"
          placeholder="Повторите пароль"
          value={repeat}
          onChange={(e) => setRepeat(e.target.value)}
          required
          disabled={loading}
          minLength={6}
        />

        {error && <div className={styles.errorContainer}>{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className={styles.modal__btnSignupEnt}
        >
          {loading ? "Загрузка..." : "Зарегистрироваться"}
        </button>
      </form>

      <Link
        href="/auth/signin"
        className={styles.modal__btnSignup}
        onClick={(e) => loading && e.preventDefault()}
      >
        Уже есть аккаунт? Войти
      </Link>
    </div>
  );
}
