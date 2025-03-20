import { useEffect, useRef } from "react";
import { ActionWrapper } from "./ActionWrapper";

type LogEntry = {
  type: string;
  message: string;
  chainName?: string;
};

type LogsContainerProps = {
  logs: LogEntry[];
  title?: string;
  className?: string;
};

export const LogsContainer = ({ logs, title = "Logs" }: LogsContainerProps) => {
  const logsContainerRef = useRef<HTMLDivElement>(null);

  // Effect to scroll to bottom whenever logs change
  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop =
        logsContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <ActionWrapper className="w-full">
      <h3 className="text-lg font-bold">{title}</h3>
      <div
        ref={logsContainerRef}
        className="flex flex-col gap-2 mt-2 h-64 overflow-y-auto border border-gray-200 rounded p-2"
      >
        {logs.map((event, index) => (
          <div key={index}>
            {event.type}: {event.message}{" "}
            {event.chainName ? `(${event.chainName})` : ""}
          </div>
        ))}
      </div>
    </ActionWrapper>
  );
};
