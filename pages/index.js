import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import { BsFillCalendarEventFill } from 'react-icons/bs';

const SYMPTOM_GOOD = 3;
const SYMPTOM_AVERAGE = 2;
const SYMPTOM_BAD = 1;

const formatDate = (dateToFormat) => {
  return dateToFormat.toISOString().slice(0, 10);
};

const getEntriesInMonth = (YYYYMMDDString) => {
  const yearMonth = YYYYMMDDString.slice(0, 7);
  return fetch(`/api/entries?yearMonth=${yearMonth}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => res.json());
};

const getEntryByDate = (YYYYMMDDString) => {
  return fetch(`/api/entries/${YYYYMMDDString}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => res.json());
};

const putEntryByDate = (YYYYMMDDString, form) => {
  return fetch(`/api/entries/${YYYYMMDDString}`, {
    method: 'PUT',
    body: JSON.stringify(form),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => res.json());
};

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(
    new Date()
  );
  const [showCalendar, setShowCalendar] = useState(false);
  const [entriesOfMonth, setEntriesOfMonth] = useState([]);

  const gotoToday = () => {
    setSelectedDate(new Date());
  };

  const [form, setForm] = useState({
    symptoms: 1,
    isDairy: true,
    isSalty: true,
  });

  const fetchSelectedDateFromApi = (dateToFetch) => {
    getEntryByDate(formatDate(dateToFetch)).then((entry) =>
      setForm(entry)
    );
  };

  const fetchEntriesOfMonthFromApi = (dateToFetch) => {
    getEntriesInMonth(formatDate(selectedDate)).then(
      (entries) => setEntriesOfMonth(entries)
    );
  };

  const gotoPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
    fetchSelectedDateFromApi(newDate);
  };

  const gotoNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
    fetchSelectedDateFromApi(newDate);
  };

  useEffect(() => {
    fetchSelectedDateFromApi(selectedDate);
    fetchEntriesOfMonthFromApi(selectedDate);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await putEntryByDate(formatDate(selectedDate), form);
    // TODO: this is bad performance
    await fetchEntriesOfMonthFromApi(selectedDate);
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
        {showCalendar && (
          <Calendar
            className={styles.calendar}
            onChange={(datePicked) => {
              setSelectedDate(datePicked);
              fetchSelectedDateFromApi(datePicked);
              setShowCalendar(false);
            }}
            tileClassName={({ date, view }) => {
              const formattedDate = formatDate(date);
              const entry = entriesOfMonth.find(
                (entry) => entry.date === formattedDate
              );
              if (entry) {
                let symptoms;
                if (entry.symptoms === SYMPTOM_GOOD) {
                  symptoms = 'good';
                } else if (
                  entry.symptoms === SYMPTOM_AVERAGE
                ) {
                  symptoms = 'average';
                } else if (entry.symptoms === SYMPTOM_BAD) {
                  symptoms = 'bad';
                }
                return `calendar-${symptoms}-day`;
              }
            }}
          />
        )}

        <h2>
          <button onClick={gotoPreviousDay}>{'<'}</button>
          Selected Date: {formatDate(selectedDate)}
          <button onClick={gotoNextDay}>{'>'}</button>
          <button
            onClick={() => setShowCalendar(!showCalendar)}
          >
            <BsFillCalendarEventFill />
          </button>
          <button onClick={gotoToday}>Go To Today</button>
        </h2>

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
