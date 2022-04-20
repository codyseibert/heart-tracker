import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useEffect, useState } from 'react';

const SYMPTOM_GOOD = 3;
const SYMPTOM_AVERAGE = 2;
const SYMPTOM_BAD = 1;

export default function Home() {
  const [form, setForm] = useState({
    symptoms: 1,
    isDairy: true,
    isSalty: true,
  });

  useEffect(() => {
    fetch('/api/entries', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((todaysForm) => {
        if (todaysForm) {
          setForm(todaysForm);
        }
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch('/api/entries', {
      method: 'PUT',
      body: JSON.stringify(form),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta
          name="description"
          content="Generated by create next app"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <form
          className={styles.symptomsForm}
          onSubmit={handleSubmit}
        >
          <h3>Symptoms</h3>
          <label>
            <input
              onChange={(e) =>
                setForm({
                  ...form,
                  symptoms: SYMPTOM_GOOD,
                })
              }
              checked={form.symptoms === SYMPTOM_GOOD}
              type="radio"
              name="symptoms"
            />
            Feeling good
          </label>

          <label>
            <input
              type="radio"
              checked={form.symptoms === SYMPTOM_AVERAGE}
              onChange={(e) =>
                setForm({
                  ...form,
                  symptoms: SYMPTOM_AVERAGE,
                })
              }
              name="symptoms"
            />
            Average
          </label>

          <label>
            <input
              onChange={(e) =>
                setForm({
                  ...form,
                  symptoms: SYMPTOM_BAD,
                })
              }
              checked={form.symptoms === SYMPTOM_BAD}
              type="radio"
              name="symptoms"
            />
            Bad
          </label>

          <h3>Data Points</h3>
          <label>
            <input
              name="isDairy"
              type="checkbox"
              checked={form.isDairy}
              onChange={() =>
                setForm({
                  ...form,
                  isDairy: !form.isDairy,
                })
              }
            />
            Did you have dairy today?
          </label>

          <label>
            <input
              name="isSalty"
              type="checkbox"
              checked={form.isSalty}
              onChange={() =>
                setForm({
                  ...form,
                  isSalty: !form.isSalty,
                })
              }
            />
            Did you have a lot of salt today?
          </label>

          <button type="submit">Save</button>
        </form>
      </main>
    </div>
  );
}
