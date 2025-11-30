"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import styles from "./page.module.css";

const floatingDots = Array.from({ length: 14 }).map((_, index) => ({
  id: index,
  delay: Math.random() * 2,
  duration: 6 + Math.random() * 4,
  x: (Math.random() - 0.5) * 120,
  y: (Math.random() - 0.5) * 120,
  size: 6 + Math.random() * 18,
}));

export default function Home() {
  const floatingPieces = useMemo(() => floatingDots, []);

  return (
    <div className={styles.page}>
      <div className={styles.gradientGlow} />
      <div className={styles.noiseOverlay} />
      <motion.div
        className={styles.backgroundOrb}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
      />

      {floatingPieces.map((dot) => (
        <motion.span
          key={dot.id}
          className={styles.floatingDot}
          style={{ width: dot.size, height: dot.size }}
          animate={{
            x: [0, dot.x, -dot.x * 0.7, 0],
            y: [0, dot.y, -dot.y * 0.5, 0],
            opacity: [0.25, 0.8, 0.5, 0.25],
          }}
          transition={{
            repeat: Infinity,
            duration: dot.duration,
            delay: dot.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      <main className={styles.shell}>
        <section className={styles.hero}> 
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={styles.brand}
          >
            <div className={styles.logoWrap}>
              <div className={styles.logoInner}>
                <span className={styles.logoInitials}>AF</span>
                <span className={styles.logoTag}>Portal</span>
              </div>
            </div>
            <div>
              <p className={styles.kicker}>Welcome back</p>
              <h1 className={styles.title}>Arena Fox Access</h1>
              <p className={styles.subtitle}>
                A calmer, softer sign-in crafted with airy blues, warm clay, and
                a hint of sunrise cream so every login feels intentional.
              </p>
            </div>
          </motion.div>

          <motion.div
            className={styles.card}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
          >
            <header className={styles.cardHeader}>
              <div>
                <p className={styles.cardKicker}>Secure Login</p>
                <h2 className={styles.cardTitle}>Enter the calm arena</h2>
              </div>
              <motion.span
                className={styles.statusPill}
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                Stable
              </motion.span>
            </header>

            <form className={styles.form}>
              <label className={styles.label}>
                Email
                <input
                  className={styles.input}
                  type="email"
                  name="email"
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
                  boxShadow: "0 15px 60px rgba(158, 185, 212, 0.35)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                Continue
                <motion.span
                  className={styles.spark}
                  animate={{ x: [0, 14, 0] }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                />
              </motion.button>
            </form>

            <footer className={styles.footer}>
              <div>
                <p className={styles.footerTitle}>New to Arena Fox?</p>
                <p className={styles.footerText}>
                  Build an account with layered security and graceful controls.
                </p>
              </div>
              <button className={styles.secondary}>Create account</button>
            </footer>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
