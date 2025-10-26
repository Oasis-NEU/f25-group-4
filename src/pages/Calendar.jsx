import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function CalendarPage() {
  const [value, setValue] = useState(new Date());

  return (
    <section className="card" style={{ textAlign: "center" }}>
      <h1>Calendar</h1>
      <p>Select a date to view activities or health data.</p>

      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <Calendar onChange={setValue} value={value} />
      </div>

      <p style={{ marginTop: "20px" }}>
        <strong>Selected date:</strong> {value.toDateString()}
      </p>
    </section>
  );
}
