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
    geo_address_json?: {
      type?: string;
      place_id?: string;
      address?: string;
      description?: string;
    };
    tags?: string[];
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
        <a className="event-box relative p-4 border rounded-lg shadow-md bg-white" key={api_id} href={event.url} target="_blank" rel="noopener noreferrer">
          <p className="text-md text-gray-500 dark:text-gray-400">
            {moment(event.start_at).tz("Australia/Sydney").format('DD MMM')}
            <span style={{ opacity: 0.5 }}> {moment(event.start_at).tz("Australia/Sydney").format('dddd')}</span>
          </p>
          <div className="grid gap-1">
            <h3 className="text-lg font-semibold">{event.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {moment(event.start_at).tz("Australia/Sydney").format('h:mm A')} - {moment(event.end_at).tz("Australia/Sydney").format('h:mm A z')}
            </p>
            {event.geo_address_json && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {event.geo_address_json.type && (
                  <p>Type: {event.geo_address_json.type}</p>
                )}
                {event.geo_address_json.place_id && (
                  <p>Place ID: {event.geo_address_json.place_id}</p>
                )}
                {event.geo_address_json.address && (
                  <p>Address: {event.geo_address_json.address}</p>
                )}
                {event.geo_address_json.description && (
                  <p>Description: {event.geo_address_json.description}</p>
                )}
              </div>
            )}
            {event.tags && event.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {event.tags.map((tag, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">{tag}</span>
                ))}
              </div>
            )}
            <p className="text-md text-green-500 font-semibold mt-2">
              Register To Attend
              <span className="inline-block ml-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 3.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-7 7a1 1 0 01-.707.293H6a1 1 0 01-1-1v-3a1 1 0 01.293-.707l7-7zm1.414 1.414L8 11.414V12h.586l5.707-5.707-1.586-1.586z" clipRule="evenodd" />
                </svg>
              </span>
            </p>
            {event.cover_url && <img src={event.cover_url} alt={event.name} className="rounded-md max-w-[20%] ml-auto p-4" style={{ borderRadius: '4px', padding: '15px' }} />}
          </div>
        </a>
      ))}
    </div>
  );
};

export default EventList;
