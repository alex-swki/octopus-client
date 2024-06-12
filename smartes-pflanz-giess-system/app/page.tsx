"use client";

import styles from "./page.module.css";
import { useState, useEffect } from "react";
import { IconDropletX, IconSkull, IconDropletCheck } from "@tabler/icons-react";

export default function Home() {
  const [feuchtigkeit, setFeuchtigkeit] = useState(Number);
  const [isLoading, setLoading] = useState(true);

  interface apiData {
    last_value: number;
  }

  useEffect(() => {
    function getData() {
      fetch("https://io.adafruit.com/api/v2/alescha06/feeds/smartes-pflanzen-giess-system")
        .then((res) => res.json())
        .then((data: apiData) => {
          setFeuchtigkeit(data.last_value);
          // setFeuchtigkeit(90.0);
          setLoading(false);
        });
    }

    getData();
    const refreshInterval = setInterval(() => {
      getData();
    }, 500);

    return () => clearInterval(refreshInterval);
  }, []);

  if (isLoading)
    return (
      <main className={styles.main}>
        <h1>Lade ...</h1>
      </main>
    );
  if (!feuchtigkeit) return <p>Keine Daten</p>;

  return (
    <main className={`${styles.main} ${feuchtigkeit < 30 ? styles.red : feuchtigkeit >= 30 && feuchtigkeit < 50 ? styles.yellow : feuchtigkeit >= 50 && feuchtigkeit < 90 ? styles.green : feuchtigkeit >= 90 ? styles.red : styles.black}`}>
      {feuchtigkeit < 30 ? (
        <IconSkull className={styles.icon} />
      ) : feuchtigkeit >= 30 && feuchtigkeit < 50 ? (
        <IconDropletX className={styles.icon} />
      ) : feuchtigkeit >= 50 && feuchtigkeit < 90 ? (
        <IconDropletCheck className={styles.icon} />
      ) : feuchtigkeit >= 90 ? (
        <IconSkull className={styles.icon} />
      ) : (
        styles.black
      )}
      <h1>
        {feuchtigkeit < 30
          ? "Der Boden ist zu trocken!"
          : feuchtigkeit >= 30 && feuchtigkeit < 50
          ? "Der Boden ist bald zu trocken!"
          : feuchtigkeit >= 50 && feuchtigkeit < 90
          ? "Der Boden ist feucht genug."
          : feuchtigkeit >= 90
          ? "Der Boden ist zu feucht!"
          : styles.black}
      </h1>
      <div className={styles.container}>
        <h3 className={styles.subtitle}>Zuletzt gemessene Bodenfeuchtigkeit</h3>
        <p className={styles.feuchtigkeitswert}>{(Math.round(feuchtigkeit * 100) / 100).toFixed(2)}%</p>
      </div>
    </main>
  );
}
