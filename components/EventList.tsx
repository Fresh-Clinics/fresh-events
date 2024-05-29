"use client"; // This directive tells Next.js to treat this file as a client component

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

const getEvents = async (): Promise<EventData[]> => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_LUMA_API_KEY;
    console.log('Using API Key:', apiKey); // Log the API key (ensure it's not logged in production)
    if (!apiKey) {
      throw new Error("API key is missing");
    }

    const res = await fetch("https://api.lu.ma/public/v1/calendar/list-events", {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-luma-api-key": apiKey,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Failed to fetch data:", res.status, errorText);
      throw new Error("Failed to fetch data");
    }

    const data = (await res.json()) as { entries: EventData[] };
    console.log("Fetched events data:", data.entries);
    return data.entries;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

export const EventList: React.FC = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const currentDate = moment().tz("Australia/Sydney").startOf('day');
    getEvents().then(events => {
      const futureEvents = events.filter(({ event }) => moment(event.start_at).tz("Australia/Sydney") >= currentDate);
      setEvents(futureEvents);
    }).catch(err => setError(err.message));
  }, []);

  if (error) {
    return <p>Error loading events: {error}</p>;
  }

  return (
    <div className="grid gap-4">
      {events.map(({ event, api_id }) => (
        <a className="event-box" key={api_id} href={event.url} target="_blank" rel="noopener noreferrer">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {moment(event.start_at).tz("Australia/Sydney").format('MMMM Do YYYY')}
          </p>
          <div className="grid gap-1">
            <h3 className="text-lg font-semibold">{event.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {moment(event.start_at).tz("Australia/Sydney").format('h:mm A')} - {moment(event.end_at).tz("Australia/Sydney").format('h:mm A')}
            </p>
            <img src={event.cover_url} alt={event.name} className="w-full h-auto mt-2" />
            <p className="text-md text-green-500 font-semibold padding-top">
                Register To Attend
            </p>
          </div>
        </a>
      ))}
    </div>
  );
};
