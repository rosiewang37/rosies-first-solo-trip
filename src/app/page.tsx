import Link from 'next/link';

export default function Home() {
  return (
    <div className="page-center">
      <h1>Hi, I&apos;m Rosie.</h1>
      <p>
        This is my corner of the internet. Right now it&apos;s mostly a trip planner I&apos;m using for my Boston and NYC trip. More to come.
      </p>
      <p style={{ marginTop: 24 }}>
        <Link href="/trips/boston-nyc" className="inline">
          Boston + NYC (Apr 25 to May 2, 2026) →
        </Link>
      </p>
    </div>
  );
}
