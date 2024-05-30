"use client";

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
    tags: string[]; // Add tags field
  };
};

const getEvents = async (): Promise<EventData[]> => {
  const res = await fetch("https://api.lu.ma/public/v1/calendar/list-events", {
    method: "GET",
    headers: {
      accept: "application/json",
      "x-luma-api-key": process.env.NEXT_PUBLIC_LUMA_API_KEY as string,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = (await res.json()) as { entries: EventData[] };
  return data.entries;
};

const EventList: React.FC = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents = await getEvents();
        setEvents(fetchedEvents);
      } catch (err) {
        setError((err as Error).message);
      }
    };
    fetchEvents();
  }, []);

  const currentDate = moment().tz("Australia/Sydney").startOf('day'); // Set the current date to start of the day in AEST

  const futureEvents = events.filter(({ event }) => moment(event.start_at).tz("Australia/Sydney") >= currentDate);

  if (error) {
    return <p>Error loading events: {error}</p>;
  }

  return (
    <div className="grid gap-4">
      {futureEvents.map(({ event, api_id }) => (
        <a className="event-box relative" key={api_id} href={event.url} target="_blank" rel="noopener noreferrer">
          <p className="text-md text-gray-500 dark:text-gray-400">
            {moment(event.start_at).tz("Australia/Sydney").format('DD MMM')}
            <span style={{ opacity: 0.5 }}> {moment(event.start_at).tz("Australia/Sydney").format('dddd')}</span>
          </p>
          <div className="grid gap-1">
            <h3 className="text-lg font-semibold">{event.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {moment(event.start_at).tz("Australia/Sydney").format('h:mm A')} - {moment(event.end_at).tz("Australia/Sydney").format('h:mm A z')}
            </p>
            <p className="text-md text-green-500 font-semibold padding-top">
              Register To Attend
              <span className="ml-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="inline h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h1m0 0h-1V7h1m0 9h-1v-4h1m0 0h-1V7h1m0 9h-1v-4h1m0 0h-1V7h1m0 9h-1v-4h1m0 0h-1V7h1m0 9h-1v-4h1m0 0h-1V7h1m0 9h-1v-4h1m0 0h-1V7h1m0 9h-1v-4h1m0 0h-1V7h1m0 9h-1v-4h1m0 0h-1V7h1m0 9h-1v-4h1m0 0h-1V7h1m0 9h-1v-4h1m0 0h-1V7h1m0 9h-1v-4h1m0 0h-1V7h1m0 9h-1v-4h1m0 0h-1V7h1m0 9h-1v-4h1m0 0h-1V7h1m0 9h-1v-4h1m0 0h-1V7h1m0 9h-1v-4h1m0 0h-1V7h1m0 9h-1v-4h1" />
                </svg>
              </span>
            </p>
            {event.tags && event.tags.map(tag => (
              <span key={tag} className="text-sm text-gray-600 dark:text-gray-300 mr-2">#{tag}</span>
            ))}
            {event.cover_url && <img src={event.cover_url} alt={event.name} className="rounded-md max-w-[20%] ml-auto mt-4" style={{ padding: '15px' }} />}
          </div>
        </a>
      ))}
    </div>
  );
};

export default EventList;
