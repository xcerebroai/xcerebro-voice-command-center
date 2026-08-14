import {
  Flame,
  CalendarCheck,
  PhoneCall,
  Phone,
  BadgeDollarSign,
  FileSignature,
  type LucideIcon,
} from "lucide-react";

export interface Kpi {
  id: string;
  label: string;
  icon: LucideIcon;
  /** true → show today's date range under the label (like the GHL widgets) */
  showDateRange?: boolean;
  value: number;
  delta: string;
  compare: string;
}

/**
 * INFINITY CASH OFFER pipeline KPIs.
 * Phase 1: mocked values. Phase 2: pull live numbers from Jarvis (GoHighLevel)
 * via the Hermes tool layer and update these through the agent event stream.
 */
export const kpis: Kpi[] = [
  { id: "hot-lead", label: "HOT LEAD", icon: Flame, value: 0, delta: "0%", compare: "vs last 31 days" },
  { id: "appt-follow-up", label: "APPOINTMENT FOLLOW UP", icon: CalendarCheck, value: 0, delta: "0%", compare: "vs last 31 days" },
  { id: "follow-up-calls", label: "FOLLOW UP CALLS", icon: PhoneCall, showDateRange: true, value: 0, delta: "0%", compare: "vs Yesterday" },
  { id: "dials", label: "DIALS", icon: Phone, showDateRange: true, value: 0, delta: "0%", compare: "vs Yesterday" },
  { id: "offer-made", label: "OFFER MADE", icon: BadgeDollarSign, value: 0, delta: "0%", compare: "vs last 31 days" },
  { id: "contracts", label: "CONTRACTS", icon: FileSignature, value: 0, delta: "0%", compare: "vs last 31 days" },
];
