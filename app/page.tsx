"use client";

import { motion } from "framer-motion";
import styles from "./page.module.css";

export default function Home() {
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
            Track players manage events and organize your alliance easily
          </motion.p>

          <motion.h1
            className={styles.title}
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          >
            ArenaFox Smart Kingshot Player Tracker and Event Manager
          </motion.h1>

          <motion.p
            className={styles.subtitle}
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.75, ease: "easeOut", delay: 0.14 }}
          >
            ArenaFox is a simple and smart tool for Kingshot alliances. Detect player names from screenshots, store profiles, track events, and maintain participation history.
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
              <p className={styles.cardKicker}>Alliance access</p>
              <h2 className={styles.cardTitle}>Sign in to ArenaFox</h2>
            </div>
            <motion.span
              className={styles.statusPill}
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2.4, repeat: Infinity }}
            >
              Online
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
            <button className={styles.secondary}>Create account</button>
          </footer>
        </motion.section>
      </main>
    </div>
  );
}
