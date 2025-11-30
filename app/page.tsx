"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const phrases = [
  "Smart Kingshot player tracker",
  "Event-ready alliance intelligence",
  "Signal-perfect recon workflows",
];

export default function Home() {
  const [displayText, setDisplayText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fullText = phrases[phraseIndex];
    const delta = isDeleting ? 40 : 80;

    const timeout = setTimeout(() => {
      setDisplayText((current) => {
        const updated = isDeleting
          ? fullText.substring(0, current.length - 1)
          : fullText.substring(0, current.length + 1);

        if (!isDeleting && updated === fullText) {
          setTimeout(() => setIsDeleting(true), 1000);
        }

        if (isDeleting && updated === "") {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % phrases.length);
        }

        return updated;
      });
    }, delta);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, phraseIndex]);

  return (
    <div className="page">
      <header className="navbar navbar-expand-md navbar-dark gradient-nav">
        <div className="container-xl">
          <Link className="navbar-brand" href="#">
            <span className="navbar-brand-text fw-bold">ArenaFox</span>
            <span className="badge bg-primary ms-3">Kingshot command</span>
          </Link>

          <div className="navbar-nav flex-row order-md-last">
            <Link className="btn btn-primary" href="#login">
              Login
            </Link>
            <button
              className="navbar-toggler ms-3"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbar-menu"
              aria-controls="navbar-menu"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>
          </div>

          <div className="collapse navbar-collapse" id="navbar-menu">
            <div className="navbar-nav ms-auto">
              <Link className="nav-link" href="#home">
                Home
              </Link>
              <Link className="nav-link" href="#about">
                About
              </Link>
              <Link className="nav-link" href="#login">
                Access
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="page-wrapper" id="home">
        <section className="hero-shell">
          <div className="container-xl">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="hero-card text-center">
                  <div className="badge bg-dark text-uppercase letter-spaced mb-3">
                    Arena Fox Alliance Portal
                  </div>
                  <h1 className="display-4 fw-bold mb-3">Command the signal, guide the alliance.</h1>
                  <div className="type-line" aria-live="polite">
                    <span className="typewriter">{displayText}</span>
                    <span className="cursor" aria-hidden>
                      |
                    </span>
                  </div>
                  <p className="lead text-muted-soft mt-3 mb-4">
                    Arena Fox keeps your Kingshot roster ready with crisp tracking, effortless event prep, and clear intel at a glance.
                  </p>

                  <div className="hero-visual mx-auto">
                    <Image
                      src="/arena-fox.svg"
                      alt="Arena Fox crowned fox emblem"
                      fill
                      priority
                      sizes="(min-width: 992px) 420px, 70vw"
                      className="logo-img"
                    />
                  </div>

                  <div className="btn-list justify-content-center mt-4" id="login">
                    <Link className="btn btn-primary btn-lg" href="#">
                      Login to dashboard
                    </Link>
                    <Link className="btn btn-outline-primary btn-lg" href="#about">
                      Learn more
                    </Link>
                  </div>
                </div>
                <p className="text-center small text-muted mt-3" id="about">
                  Built with the Tabler admin system and tuned to the teal-and-gold palette that defines Arena Fox.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
