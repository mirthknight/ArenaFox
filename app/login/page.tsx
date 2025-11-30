"use client";

import { FormEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import styles from "../page.module.css";
import { getStoredUser, setStoredUser } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("you@arenafox.com");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const existingUser = getStoredUser();
    if (existingUser) {
      router.replace("/dashboard");
      return;
    }

    setLoading(false);
  }, [router]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setStoredUser({ email });
    router.replace("/dashboard");
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.backdropGrid} aria-hidden />
        <div className={styles.backdropGlow} aria-hidden />
        <main className={styles.shell}>
          <section className={styles.brandCard}>
            <p className={styles.subtitle}>Preparing your secure session...</p>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.backdropGrid} aria-hidden />
      <div className={styles.backdropGlow} aria-hidden />

      <main className={styles.shell}>
        <section className={styles.brandCard}>
          <motion.div
            className={styles.brandMark}
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className={styles.brandInitials}>AF</span>
            <span className={styles.brandAccent} />
          </motion.div>

          <motion.p
            className={styles.kicker}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
          >
            Alliance access
          </motion.p>

          <motion.h1
            className={styles.title}
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          >
            Sign in to ArenaFox
          </motion.h1>

          <motion.p
            className={styles.subtitle}
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.75, ease: "easeOut", delay: 0.14 }}
          >
            Enter your credentials to access the command center.
          </motion.p>
        </section>

        <motion.section
          className={styles.card}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.08 }}
        >
          <header className={styles.cardHeader}>
            <div>
              <p className={styles.cardKicker}>Secure login</p>
              <h2 className={styles.cardTitle}>Continue to dashboard</h2>
            </div>
            <motion.span
              className={styles.statusPill}
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2.4, repeat: Infinity }}
            >
              Online
            </motion.span>
          </header>

          <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.label}>
              Email
              <input
                className={styles.input}
                type="email"
                name="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@arenafox.com"
                autoComplete="email"
                required
              />
            </label>

            <label className={styles.label}>
              Password
              <input
                className={styles.input}
                type="password"
                name="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </label>

            <div className={styles.actions}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" className={styles.checkbox} />
                Keep me signed in
              </label>
              <button type="button" className={styles.linkButton}>
                Trouble signing in?
              </button>
            </div>

            <motion.button
              type="submit"
              className={styles.submit}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 12px 40px rgba(0, 173, 181, 0.25)",
              }}
              whileTap={{ scale: 0.98 }}
            >
              Continue
              <motion.span
                className={styles.spark}
                animate={{ x: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
              />
            </motion.button>
          </form>

          <footer className={styles.footer}>
            <div>
              <p className={styles.footerTitle}>New to ArenaFox?</p>
              <p className={styles.footerText}>Create an account to manage members with clarity.</p>
            </div>
            <button className={styles.secondary} type="button" onClick={() => router.push("/")}>
              Back to landing
            </button>
          </footer>
        </motion.section>
      </main>
    </div>
  );
}
