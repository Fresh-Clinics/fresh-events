import React, { useEffect, useState } from 'react';
import moment from 'moment-timezone';

type EventData = {
  api_id: string;
  event: {
    api_id: string;
    name: string;
    start_at: string;
    end_at: string;
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
    throw new Error("Failed to fetch data");
  }

  const data = (await res.json()) as { entries: EventData[] };
  return data.entries;
}

export const EventList: React.FC = () => {
  const [events, setEvents] = useState<EventData[]>([]);

  useEffect(() => {
    getEvents().then(setEvents);
  }, []);

  const currentDate = moment().tz("Australia/Sydney").startOf('day'); // Set the current date to start of the day in AEST
  const futureEvents = events.filter(({ event }) => moment(event.start_at).tz("Australia/Sydney") >= currentDate);

  return (
    <div className="grid gap-4">
      {futureEvents.map(({ event, api_id }) => (
        <a className="event-box" key={api_id} href={event.url} target="_blank" rel="noopener noreferrer">
          <img src={event.cover_url} alt={event.name} className="event-image" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {moment(event.start_at).tz("Australia/Sydney").format('MMMM Do YYYY')}
          </p>
          <div className="grid gap-1">
            <h3 className="text-lg font-semibold">{event.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {moment(event.start_at).tz("Australia/Sydney").format('h:mm A')} - {moment(event.end_at).tz("Australia/Sydney").format('h:mm A')}
            </p>
            <p className="text-md text-green-500 font-semibold padding-top">
                Register To Attend
            </p>
          </div>
        </a>
      ))}
    </div>
  );
};
