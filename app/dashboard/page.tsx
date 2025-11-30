"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import styles from "../page.module.css";
import { clearStoredUser, getStoredUser, type AuthUser } from "@/lib/auth";

type EventRow = {
  title: string;
  date: string;
  status: "Scheduled" | "In progress" | "Completed";
  attendees: number;
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = getStoredUser();

    if (!stored) {
      router.replace("/login");
      return;
    }

    setUser(stored);
    setLoading(false);
  }, [router]);

  const events: EventRow[] = useMemo(
    () => [
      {
        title: "Kingdom scrimmage briefing",
        date: "Oct 12, 2024",
        status: "Scheduled",
        attendees: 18,
      },
      {
        title: "Shadow realm cleanup",
        date: "Oct 9, 2024",
        status: "Completed",
        attendees: 22,
      },
      {
        title: "Alliance recruitment call",
        date: "Oct 7, 2024",
        status: "In progress",
        attendees: 11,
      },
    ],
    []
  );

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.backdropGrid} aria-hidden />
        <div className={styles.backdropGlow} aria-hidden />
        <main className={styles.shell}>
          <section className={styles.brandCard}>
            <p className={styles.subtitle}>Checking your session...</p>
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
          <motion.p
            className={styles.kicker}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
          >
            Command center
          </motion.p>

          <motion.h1
            className={styles.title}
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          >
            Welcome back, {user?.email}
          </motion.h1>

          <motion.p
            className={styles.subtitle}
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.75, ease: "easeOut", delay: 0.14 }}
          >
            Track events, monitor alliance health, and jump back into your workflows.
          </motion.p>

          <div className={styles.actions}>
            <button className={styles.secondary} onClick={() => router.push("/")}>
              Guest landing
            </button>
            <button
              className={styles.submit}
              onClick={() => {
                clearStoredUser();
                router.replace("/login");
              }}
            >
              Sign out
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
              <p className={styles.cardKicker}>Events</p>
              <h2 className={styles.cardTitle}>Alliance schedule</h2>
            </div>
            <motion.span
              className={styles.statusPill}
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2.4, repeat: Infinity }}
            >
              Synced
            </motion.span>
          </header>

          <div className={styles.tableWrapper}>
            <div className={styles.tableHead}>
              <span>Title</span>
              <span>Date</span>
              <span>Status</span>
              <span>Attendees</span>
            </div>
            {events.map((event) => (
              <div className={styles.tableRow} key={event.title}>
                <span className={styles.tablePrimary}>{event.title}</span>
                <span>{event.date}</span>
                <span className={styles.badge}>{event.status}</span>
                <span>{event.attendees}</span>
              </div>
            ))}
          </div>
        </motion.section>
      </main>
    </div>
  );
}
