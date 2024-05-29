import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
       <iframe
  src="https://lu.ma/embed/calendar/cal-PfKCHyYHQHvdr87/events"
  width="80%"
  height="100%"
  frameborder="0"
  style="border:none!important;"
></iframe>
      </div>
    </main>
  );
}
