"use client";

import React, { useEffect, useState } from "react";
import moment from "moment-timezone";

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
  const res = await fetch("https://api.lu.ma/public/v1/calendar/list-events?limit=100", {
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
  console.log("Fetched Events:", data.entries); // Log all fetched events
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

  const currentDate = moment().tz("Australia/Sydney").startOf("day");

  const futureEvents = events.filter(({ event }) =>
    moment(event.start_at).tz("Australia/Sydney").isSameOrAfter(currentDate)
  );

  if (error) {
    return <p>Error loading events: {error}</p>;
  }

  return (
    <div className="grid gap-4">
      {futureEvents.map(({ event, api_id }) => (
        <a className="event-box" key={api_id} href={event.url} target="_blank" rel="noopener noreferrer">
          <p className="text-md text-gray-500 dark:text-gray-400">
            <strong>{moment(event.start_at).tz("Australia/Sydney").format("DD MMM")}</strong>
            <span style={{ opacity: 0.5 }}> {moment(event.start_at).tz("Australia/Sydney").format("dddd")}</span>
          </p>
          <div className="event-content">
            <h2 className="text-lg font-semibold">{event.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {moment(event.start_at).tz("Australia/Sydney").format("h:mm A")} -{" "}
              {moment(event.end_at).tz("Australia/Sydney").format("h:mm A z")}
            </p>
            {event.cover_url && <img src={event.cover_url} alt={event.name} className="rounded-md event-image" />}
          </div>
        </a>
      ))}
    </div>
  );
};

export default EventList;
