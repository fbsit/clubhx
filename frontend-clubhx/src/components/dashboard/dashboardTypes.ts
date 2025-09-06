
import { ReactNode } from "react";

export type Order = {
  id: string;
  date: string;
  total: number;
  status: "requested" | "accepted" | "invoiced" | "shipped" | "completed" | "rejected" | "canceled";
  items: number;
};

export type Event = {
  id: string;
  title: string;
  date: string;
  type: string;
  brand: string;
};

export type StatusCardProps = {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle: string;
  gradient?: string;
  delay?: number;
};

export type CollapsibleState = "expanded" | "collapsed" | "icon";

export type SidebarTriggerProps = {
  className?: string;
  icon?: ReactNode;
};

export type StatusBadgeAnimationProps = {
  status: Order["status"];
  children: React.ReactNode;
  className?: string;
};

export type CollapsibleSidebarProps = {
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
  header?: React.ReactNode;
};
