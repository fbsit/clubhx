
import React from "react";

type Stat = {
  label: string;
  value: number | string;
  color?: string;
};

type ClientListStatsProps = {
  stats: Stat[];
};

export const ClientListStats: React.FC<ClientListStatsProps> = ({ stats }) => {
  return (
    <div className="flex gap-4 my-4">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className={`rounded-2xl px-6 py-4 bg-softgray shadow-sm flex flex-col items-center min-w-[110px]`}
          style={{ background: stat.color || "#F1F0FB" }}
        >
          <span className="text-2xl font-semibold">{stat.value}</span>
          <span className="text-xs text-muted-foreground">{stat.label}</span>
        </div>
      ))}
    </div>
  );
};
