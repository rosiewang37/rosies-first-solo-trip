import { ProgressBar } from './ProgressBar';

export function Overview({ doneCount, total }: { doneCount: number; total: number }) {
  return (
    <>
      <div className="section-intro">
        Click each day to see the full schedule. Use the to-do list to track everything you need to
        book or pack before leaving. Your progress is saved automatically across sessions.
      </div>
      <div className="info-grid">
        <div className="info-card">
          <h4>Departure</h4>
          <p className="big">Apr 25</p>
          <p>Drive from Sault Ste. Marie → Boston</p>
        </div>
        <div className="info-card">
          <h4>Boston → NYC</h4>
          <p className="big">Apr 28</p>
          <p>Afternoon bus, ~4.5 hrs</p>
        </div>
        <div className="info-card">
          <h4>Return flight</h4>
          <p className="big">May 2</p>
          <p>7:00 PM from LGA</p>
        </div>
        <div className="info-card">
          <h4>Stay #1</h4>
          <p className="big">Downtown 02109</p>
          <p>Financial District / Waterfront · 3 nights</p>
        </div>
        <div className="info-card">
          <h4>Stay #2</h4>
          <p className="big">LIC, Queens</p>
          <p>42 24th St · 4 nights</p>
        </div>
        <div className="info-card">
          <h4>Climbing gyms</h4>
          <p className="big">2 iconic</p>
          <p>Bouldering Project · The Cliffs at LIC</p>
        </div>
      </div>
      <div style={{ marginTop: 32 }}>
        <ProgressBar label="Prep progress" done={doneCount} total={total} />
      </div>
    </>
  );
}
