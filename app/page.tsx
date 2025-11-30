"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function Home() {
  const router = useRouter();

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
            Track players, manage events, and organize your alliance
          </motion.p>

          <motion.h1
            className={styles.title}
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          >
            ArenaFox Kingshot Tracker & Event Manager
          </motion.h1>

          <motion.p
            className={styles.subtitle}
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.75, ease: "easeOut", delay: 0.14 }}
          >
            Detect player names from screenshots, store profiles, and track event participation with ease.
          </motion.p>

          <div className={styles.actions}>
            <button className={styles.submit} onClick={() => router.push("/login")}>Go to login</button>
            <button className={styles.secondary} onClick={() => router.push("/dashboard")}>
              View dashboard
            </button>
          </div>
        </section>

        <motion.section
          className={styles.card}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.08 }}
        >
          <header className={styles.cardHeader}>
            <div>
              <p className={styles.cardKicker}>Guest landing</p>
              <h2 className={styles.cardTitle}>What you can expect</h2>
            </div>
            <motion.span
              className={styles.statusPill}
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2.4, repeat: Infinity }}
            >
              Preview
            </motion.span>
          </header>

          <div className={styles.gridList}>
            <div className={styles.gridItem}>
              <p className={styles.cardKicker}>Player registry</p>
              <p className={styles.gridCopy}>
                Capture Kingshot names from screenshots and build a clean roster for officers and members.
              </p>
            </div>
            <div className={styles.gridItem}>
              <p className={styles.cardKicker}>Event tracking</p>
              <p className={styles.gridCopy}>
                Plan scrimmages, raids, and calendar events, then log participation to keep history tidy.
              </p>
            </div>
            <div className={styles.gridItem}>
              <p className={styles.cardKicker}>Alliance insights</p>
              <p className={styles.gridCopy}>
                Review performance highlights, attendance stats, and member momentum at a glance.
              </p>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
