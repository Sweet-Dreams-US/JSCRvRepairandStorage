"use client";

import { useEffect, useRef } from "react";

/**
 * Fires a "mark thread read" server action once, on actual mount (real view),
 * so prefetches don't prematurely clear unread badges. Renders nothing.
 */
export function AutoMarkRead({
  accessId,
  action,
}: {
  accessId: string;
  action: (accessId: string) => Promise<void>;
}) {
  const done = useRef(false);
  useEffect(() => {
    if (done.current) return;
    done.current = true;
    void action(accessId).catch(() => {});
  }, [accessId, action]);
  return null;
}
