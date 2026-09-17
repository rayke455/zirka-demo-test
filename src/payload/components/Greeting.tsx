"use client";

import { useSyncExternalStore } from "react";

/**
 * The hour has to come from the browser — computing it on the server would
 * greet everyone in the data centre's timezone rather than their own.
 * useSyncExternalStore lets us declare a separate server snapshot, so there's
 * no hydration mismatch and no state-setting effect.
 */
const forHour = (hour: number) => {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const noopSubscribe = () => () => {};
const clientSnapshot = () => forHour(new Date().getHours());
const serverSnapshot = () => "Welcome";

export default function Greeting({ name }: { name: string }) {
  const greeting = useSyncExternalStore(noopSubscribe, clientSnapshot, serverSnapshot);

  return (
    <>
      {greeting}, {name}.
    </>
  );
}
