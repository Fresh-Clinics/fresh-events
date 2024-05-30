"use client";

import React, { useEffect, useState } from 'react';
import moment from 'moment-timezone';

type GeoAddressJson = {
  type: string;
  place_id?: string;
  address?: string;
  description?: string;
};

type EventData = {
  api_id: string;
  event: {
    api_id: string;
    name: string;
    start_at: string;
    end_at: string;
    cover_url: string;
    url: string;
    geo_address_json?: GeoAddressJson;
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
        <a className="event-box" key={api_id} href={event.url} target="_blank" rel="noopener noreferrer">
          <p className="text-md text-gray-500 dark:text-gray-400">
            <strong>{moment(event.start_at).tz("Australia/Sydney").format('DD MMM')}</strong>
            <span style={{ opacity: 0.5 }}> {moment(event.start_at).tz("Australia/Sydney").format('dddd')}</span>
          </p>
          <div className="event-content"> {/* Adjusted padding to avoid text overlap */}
            <h2 className="text-lg font-semibold">{event.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className="inline w-4 h-4" style={{ color: '#55555550', marginRight: '5px' }}>
                <path d="M2 6.854C2 11.02 7.04 15 8 15s6-3.98 6-8.146C14 3.621 11.314 1 8 1S2 3.62 2 6.854Z"></path>
                <path d="M9.5 6.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"></path>
              </svg>
              {moment(event.start_at).tz("Australia/Sydney").format('h:mm A')} - {moment(event.end_at).tz("Australia/Sydney").format('h:mm A z')}
            </p>
            {event.geo_address_json && Object.keys(event.geo_address_json).length > 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className="inline w-4 h-4" style={{ color: '#55555550', marginRight: '5px' }}>
                  <path d="M2 6.854C2 11.02 7.04 15 8 15s6-3.98 6-8.146C14 3.621 11.314 1 8 1S2 3.62 2 6.854Z"></path>
                  <path d="M9.5 6.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"></path>
                </svg>
                {event.geo_address_json.address ? (
                  <>
                    {event.geo_address_json.address}
                    {event.geo_address_json.description && ` (${event.geo_address_json.description})`}
                  </>
                ) : (
                  event.geo_address_json.description
                )}
              </p>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" className="inline w-4 h-4" style={{ color: '#55555550', marginRight: '5px' }}>
                  <path fill="currentColor" d="M48 13.208v22.704c0 1.504-.828 1.332-1.533.783L36.5 29.25v-9.38l9.967-7.446c.87-.725 1.533-.556 1.533.784ZM27.553 12c3.768-.017 6.837 3.071 6.856 6.9v16.936a1.252 1.252 0 0 1-1.246 1.255H8.856c-3.768.017-6.837-3.071-6.856-6.9V13.255A1.252 1.252 0 0 1 3.246 12Z"></path>
                </svg>
                Zoom
              </p>
            )}
            <p className="text-md text-green-500 font-semibold padding-top">
              Register
              <span className="ml-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="inline w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </p>
            {event.cover_url && <img src={event.cover_url} alt={event.name} className="rounded-md event-image" />}
          </div>
        </a>
      ))}
    </div>
  );
};

export default EventList;
