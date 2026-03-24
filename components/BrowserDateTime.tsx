"use client";

import { useEffect, useState, type CSSProperties } from "react";

interface BrowserDateTimeProps {
  value: string;
  format: "time" | "dateTime";
  fallback: string;
  className?: string;
  style?: CSSProperties;
}

const formatterByFormat: Record<
  BrowserDateTimeProps["format"],
  Intl.DateTimeFormatOptions
> = {
  time: {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  },
  dateTime: {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  },
};

const formatInBrowserTimeZone = (
  value: string,
  format: BrowserDateTimeProps["format"],
) => {
  return new Intl.DateTimeFormat("es-CO", formatterByFormat[format]).format(
    new Date(value),
  );
};

export default function BrowserDateTime({
  value,
  format,
  fallback,
  className,
  style,
}: BrowserDateTimeProps) {
  const [formatted, setFormatted] = useState(fallback);

  useEffect(() => {
    setFormatted(formatInBrowserTimeZone(value, format));
  }, [value, format]);

  return (
    <span className={className} style={style} suppressHydrationWarning>
      {formatted}
    </span>
  );
}
