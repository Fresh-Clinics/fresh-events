import { EventList } from "@/components/EventList";

export function HomePage() {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold sm:text-xl md:text-3xl">
                  Events
                </h2>
                <iframe src="https://lu.ma/embed/calendar/cal-PfKCHyYHQHvdr87/events" width="80%" height="100%"></iframe>

                <EventList />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
