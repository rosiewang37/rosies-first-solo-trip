import Link from 'next/link';

export default function TripsIndex() {
  return (
    <div className="page-center">
      <h1>Trips</h1>
      <Link href="/trips/boston-nyc" className="trip-card">
        <div className="trip-card-title">Boston + NYC</div>
        <div className="trip-card-meta">April 25 to May 2, 2026 · 8 days</div>
      </Link>
    </div>
  );
}
