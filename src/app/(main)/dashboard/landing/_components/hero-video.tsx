"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

import styles from "./site-landing.module.css";

const SOURCE = "/media/landing-hero-higgsfield-v5.mp4";
type DataConnection = {
  saveData?: boolean;
  addEventListener?: (type: string, listener: EventListener) => void;
  removeEventListener?: (type: string, listener: EventListener) => void;
};

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const togglePlayback = useRef<() => void>(() => {});
  const [hydrated, setHydrated] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [pendingPlayback, setPendingPlayback] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const target = video.parentElement ?? video;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: DataConnection }).connection;
    let visible = false;
    let userPaused = false;
    let manualConsent = false;
    let blocked = false;
    let mediaFailed = false;
    let disposed = false;
    let pending = false;
    let request = 0;
    const restricted = () => motion.matches || connection?.saveData === true;
    const allowed = () =>
      visible && !document.hidden && !userPaused && !mediaFailed && (manualConsent || (!restricted() && !blocked));

    function pause() {
      request += 1;
      pending = false;
      video!.pause();
      if (!disposed) {
        setPlaying(false);
        setPendingPlayback(false);
      }
    }
    function sync() {
      if (disposed) return;
      if (!allowed()) {
        pause();
        return;
      }
      if (pending || !video!.paused) return;
      // No source is present in server HTML or before visibility/preference checks.
      if (!video!.getAttribute("src")) video!.src = SOURCE;
      video!.muted = true;
      pending = true;
      setPendingPlayback(true);
      const current = ++request;
      void video!
        .play()
        .then(() => {
          if (disposed || current !== request) return;
          if (!allowed()) video!.pause();
        })
        .catch(() => {
          if (disposed || current !== request) return;
          blocked = true;
          manualConsent = false;
          setReady(false);
          setPlaying(false);
        })
        .finally(() => {
          if (disposed || current !== request) return;
          pending = false;
          setPendingPlayback(false);
        });
    }
    function onPlaying() {
      if (disposed) return;
      if (!allowed()) {
        pause();
        return;
      }
      setReady(true);
      setPlaying(true);
    }
    function onPause() {
      if (!disposed) setPlaying(false);
    }
    function onError() {
      if (disposed) return;
      mediaFailed = true;
      pause();
      setReady(false);
      setFailed(true);
    }
    function onPreferenceChange() {
      manualConsent = false;
      if (restricted()) setReady(false);
      sync();
    }
    function measureVisibility() {
      const rect = target.getBoundingClientRect();
      visible = rect.bottom > 0 && rect.right > 0 && rect.top < window.innerHeight && rect.left < window.innerWidth;
      sync();
    }
    togglePlayback.current = () => {
      if (pending || !video.paused) {
        userPaused = true;
        pause();
      } else {
        userPaused = false;
        manualConsent = true; // An explicit Play permits motion/data use.
        blocked = false;
        measureVisibility(); // Keep play() inside the click's user activation.
      }
    };

    video.addEventListener("playing", onPlaying);
    video.addEventListener("pause", onPause);
    video.addEventListener("error", onError);
    document.addEventListener("visibilitychange", sync);
    motion.addEventListener("change", onPreferenceChange);
    connection?.addEventListener?.("change", onPreferenceChange);
    const observer =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            sync();
          })
        : null;
    if (observer) observer.observe(target);
    else {
      window.addEventListener("scroll", measureVisibility, { passive: true });
      window.addEventListener("resize", measureVisibility);
      measureVisibility();
    }
    setHydrated(true);
    return () => {
      disposed = true;
      request += 1;
      togglePlayback.current = () => {};
      observer?.disconnect();
      window.removeEventListener("scroll", measureVisibility);
      window.removeEventListener("resize", measureVisibility);
      document.removeEventListener("visibilitychange", sync);
      motion.removeEventListener("change", onPreferenceChange);
      connection?.removeEventListener?.("change", onPreferenceChange);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("error", onError);
      video.pause();
    };
  }, []);

  return (
    <>
      <video
        ref={videoRef}
        className={styles.heroVideo}
        data-ready={ready && !failed}
        muted
        playsInline
        loop
        preload="none"
        aria-hidden="true"
        tabIndex={-1}
        disablePictureInPicture
      />
      {hydrated && !failed && (
        <button
          type="button"
          className={styles.heroVideoControl}
          onClick={() => togglePlayback.current()}
          aria-label={playing || pendingPlayback ? "Pause background video" : "Play background video"}
          title={playing || pendingPlayback ? "Pause background video" : "Play background video"}
        >
          {playing || pendingPlayback ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
        </button>
      )}
    </>
  );
}
