import React from 'react';

type EventData = {
  api_id: string;
  event: {
    api_id: string;
    name: string;
    start_at: string;
    end_at: string;
    cover_url: string;
    url: string;
    tag: string;
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
    throw new Error("Failed to fetch data");
  }

  const data = (await res.json()) as { entries: EventData[] };
  return data.entries;
}

export const EventList: React.FC = async () => {
  const events = await getEvents();
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Set the current date time to midnight to include events from today

  const futureEvents = events.filter(({ event }) => new Date(event.start_at) >= currentDate);

  return (
    <div className="grid gap-4">
      {futureEvents.map(({ event, api_id }) => (
        <a className="event-box" key={api_id} href={event.url} target="_blank" rel="noopener noreferrer">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(event.start_at).toLocaleString(undefined, {
              day: "numeric",
              month: "long",
              timeZone: "Australia/Sydney",
              year: "numeric",
            })}
          </p>
          <div className="grid gap-1">
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
            {event.tag}
            <p className="text-md text-green-500 font-semibold padding-top">
                Register To Attend
            </p>
          </div>
        </a>
      ))}
    </div>
  );
};
