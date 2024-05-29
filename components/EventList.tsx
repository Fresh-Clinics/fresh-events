type EventData = {
  api_id: string;
  event: {
    api_id: string;
    name: string;
    start_at: string;
    end_at: string
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
        <a className="event-box" href={event.url} target="_blank">
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
            })} - {new Date(event.end_at).toLocaleString(undefined, {

              hour: "numeric",
              minute: "2-digit",
            })}
          </p>
        <iframe src="{event.cover_url}" width="5em" height="5em"></iframe>
          <p className="text-md text-green-500 font-semibold padding-top">
              Register To Attend
          </p>
        </div>            </a>
      ))}
    </div>
  );
};
