type EventData = {
  api_id: string;
  event: {
    api_id: string;
    name: string;
    start_at: string;
    cover_url: string;
    url: string;
  };
};

async function getEvents(): Promise<EventData[]> {
  const res = await fetch("https://api.lu.ma/public/v1/calendar/list-events", {
    method: "GET",
    headers: {
      accept: "application/json",
      "x-luma-api-key": process.env.LUMA_API_KEY as string,
    },
  });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  const data = (await res.json()) as { entries: EventData[] };
  return data.entries;
}

export const EventList = async () => {
  const events = await getEvents();
  return (
    <div className="grid gap-4">
      {events.map(({ event, api_id }) => (
        <a href={event.url} target="_blank">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(event.start_at).toLocaleString(undefined, {
              day: "numeric",
              month: "long",
              timeZone: "Australia/Sydney",
              year: "numeric",
            })}
          </p>
      <div className="grid gap-1" key={api_id}>
          <h3 className="text-lg font-semibold">{event.name}</h3>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(event.start_at).toLocaleString(undefined, {

              hour: "numeric",
              minute: "2-digit",
            })} {new Date(event.end_at).toLocaleString(undefined, {

              hour: "numeric",
              minute: "2-digit",
            })}
          </p>
          <p className="text-sm text-green-500 font-semibold">
              Register To Attend
          </p>
        </div>            </a>
      ))}
    </div>
  );
};
 <div className="relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>

      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Docs{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Find in-depth information about Next.js features and API.
          </p>
        </a>
