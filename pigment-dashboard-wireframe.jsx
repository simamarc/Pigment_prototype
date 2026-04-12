import { useState } from "react";

// ─── Wireframe: Operator Dashboard "Today" View ───
// Sunrise Conciergerie · Marie's morning view
// Includes: left nav, today overview, property cards with varied states, agent chat panel

const COLORS = {
  bg: "#f5f5f0",
  white: "#ffffff",
  text: "#1a1a1a",
  textSecondary: "#6b6b6b",
  border: "#e0e0db",
  accent: "#e85d2a",
  accentLight: "#fef3ee",
  green: "#1a8c5a",
  greenLight: "#edf7f0",
  yellow: "#c47f17",
  yellowLight: "#fef9ec",
  red: "#d1242f",
  redLight: "#fff1f0",
  blue: "#0969da",
  blueLight: "#eff6ff",
  purple: "#8250df",
  purpleLight: "#f5f0ff",
  agentBg: "#f8f8f5",
};

// ─── Data ───
const todayStats = {
  turnovers: 3,
  activeBookings: 28,
  checkInsToday: 4,
  checkOutsToday: 3,
  needsAttention: 4,
  agentActions: 23,
};

const initialProperties = [
  {
    id: 1,
    name: "Villa Mimosa",
    address: "12 Rue Pasteur",
    status: "crisis",
    statusLabel: "Turnover at risk",
    urgency: "high",
    detail: "Cleaner cancelled · Backup found: Lea (4.8★) · Starts 10:30",
    agent: "Operations Agent",
    actionLabel: "Approve new cleaner",
    checkOut: "10:00",
    checkIn: "16:00",
    nights: 3,
    occupants: 4,
    price: "€487",
    timelineProgress: 0.3,
    whatHappened: "Cleaner Nadia messaged at 09:12 — she's sick and can't make the 10:00 turnover.",
    agentDid: "Checked backup pool → Found Léa (4.8★, 25min away). Can start at 10:30. Estimated finish: 14:30.",
    listing: { bedrooms: 2, bathrooms: 1, type: "Villa", owner: "M. Renard", nextBooking: "Jul 8 (3 nights)", rating: 4.9, reviews: 42 },
  },
  {
    id: 2,
    name: "Apt. Garibaldi",
    address: "8 Av. Garibaldi",
    status: "action",
    statusLabel: "1★ review",
    urgency: "medium",
    detail: "1★ review due to construction noise · Guest: Pierre M. · Response drafted",
    agent: "Guest Comms Agent",
    actionLabel: "Approve response",
    checkOut: "—",
    checkIn: "—",
    nights: 5,
    occupants: 2,
    price: "€612",
    timelineProgress: 0.6,
    whatHappened: "Pierre M. left a 1-star review on Airbnb citing construction noise and poor sleep for three nights. Review is now publicly visible.",
    agentDid: "Drafted an empathetic response acknowledging the noise disruption. Flagged that this is the 3rd noise complaint on this street in 2 months (across Apt. Garibaldi and Apt. Libération) — possible ongoing construction issue. Checked listing: no mention of nearby construction currently included.",
    listing: { bedrooms: 1, bathrooms: 1, type: "Apartment", owner: "Mme. Costa", nextBooking: "Jul 12 (4 nights)", rating: 4.7, reviews: 28 },
  },
  {
    id: 3,
    name: "Studio Promenade",
    address: "45 Promenade des Anglais",
    status: "action",
    statusLabel: "Payment delay",
    urgency: "medium",
    detail: "Missing invoice · Cleaner: Sophie R. (4.6★) · Due since Mar 22",
    agent: "Finance Agent",
    actionLabel: "Contact cleaner",
    actionLabel2: null,
    checkOut: "10:00",
    checkIn: "15:00",
    nights: 2,
    occupants: 2,
    price: "€244",
    timelineProgress: 0.85,
    whatHappened: "March owner payout for M. Laurent (€772) is ready, but invoice from contractor Sophie R. (€180, due 22 Mar) is missing.",
    agentDid: "Flagged the missing invoice. Sophie normally submits within 48hrs — her last invoice was on time (15 Mar). You can contact the contractor directly or exclude this cost from the payout.",
    listing: { bedrooms: 0, bathrooms: 1, type: "Studio", owner: "M. Laurent", nextBooking: "Jul 7 (2 nights)", rating: 4.6, reviews: 19 },
  },
  {
    id: 4,
    name: "Maison Cimiez",
    address: "3 Bd de Cimiez",
    status: "ok",
    statusLabel: "On track",
    urgency: "none",
    detail: "Checkout 10:00 · Cleaner Sophie confirmed for 10:30",
    agent: "Operations Agent",
    checkOut: "10:00",
    checkIn: "16:00",
    nights: 7,
    occupants: 6,
    price: "€1,890",
    timelineProgress: 0.95,
    listing: { bedrooms: 4, bathrooms: 2, type: "House", owner: "Mme. Blanc", nextBooking: "Jul 6 (5 nights)", rating: 4.9, reviews: 67 },
  },
  {
    id: 5,
    name: "Apt. Libération",
    address: "22 Av. de la Libération",
    status: "ok",
    statusLabel: "Active",
    urgency: "none",
    detail: "Day 3 of 5 · No issues · Guest comms handled autonomously",
    agent: "Guest Comms Agent",
    checkOut: "Apr 4",
    checkIn: "—",
    nights: 5,
    occupants: 3,
    price: "€520",
    timelineProgress: 0.6,
    listing: { bedrooms: 2, bathrooms: 1, type: "Apartment", owner: "M. Dupont", nextBooking: "Jul 10 (3 nights)", rating: 4.8, reviews: 35 },
  },
  {
    id: 6,
    name: "Villa Roses",
    address: "7 Chemin des Roses",
    status: "ok",
    statusLabel: "Check-in today",
    urgency: "none",
    detail: "New guest at 15:00 · Instructions sent · Lockbox code updated",
    agent: "Guest Comms Agent",
    checkOut: "—",
    checkIn: "15:00",
    nights: 4,
    occupants: 2,
    price: "€380",
    timelineProgress: 0.0,
    listing: { bedrooms: 3, bathrooms: 2, type: "Villa", owner: "Mme. Moreau", nextBooking: "Jul 12 (7 nights)", rating: 4.7, reviews: 23 },
  },
  {
    id: 8,
    name: "Apt. Masséna",
    address: "30 Av. Jean Médecin",
    status: "crisis",
    statusLabel: "Water leak",
    urgency: "high",
    detail: "Water leak · Plumber found: Marc R. (4.9★) · Price €320 (above the threshold) · Can start at 09:45",
    agent: "Maintenance Agent",
    actionLabel: "Approve plumber",
    checkOut: "11:00",
    checkIn: "16:00",
    nights: 3,
    occupants: 4,
    price: "€410",
    timelineProgress: 0.5,
    whatHappened: "Neighbor (apt. below) called at 08:30 reporting water on their ceiling. Current guest is unaware.",
    agentDid: "Dispatched emergency plumber (ETA 09:45). Notified guest about the visit. Alerted cleaning team to potential delay if leak causes damage. Estimated cost: €320 · above €200 auto-approval threshold — needs your approval.",
    listing: { bedrooms: 2, bathrooms: 1, type: "Apartment", owner: "Mme. Vidal", nextBooking: "Jul 8 (5 nights)", rating: 4.5, reviews: 18 },
  },
];

const agentMessages = [
  {
    id: 1,
    time: "09:15",
    agent: "Operations",
    agentColor: COLORS.accent,
    type: "escalation",
    urgency: "high",
    statusLabel: "Turnover at risk",
    title: "Turnover at risk — Villa Mimosa",
    body: "Cleaner Nadia cancelled (sick). I found backup: Léa available at 10:30, 25min away. This leaves a tight window before 16:00 check-in.",
    agentDid: "Checked backup pool → Found Léa (4.8★, 25min away). Can start at 10:30.",
    action: "Approve Léa as backup?",
    property: "Villa Mimosa",
    address: "12 Rue Pasteur",
    resolved: false,
  },
  {
    id: 2,
    time: "09:02",
    agent: "Maintenance",
    agentColor: COLORS.purple,
    type: "escalation",
    urgency: "high",
    statusLabel: "AC failure",
    title: "AC repair needed — Apt. Garibaldi",
    body: "Guest messaged at 08:47: 'The air conditioning stopped working overnight.' I've contacted 2 contractors — Dupont HVAC can come at 14:00 (€120 estimate).",
    agentDid: "Contacted 2 contractors. Dupont HVAC available today 14:00 (€120).",
    action: "Approve repair?",
    property: "Apt. Garibaldi",
    address: "8 Av. Garibaldi",
    resolved: false,
  },
  {
    id: 3,
    time: "08:30",
    agent: "Finance",
    agentColor: COLORS.green,
    type: "alert",
    urgency: "medium",
    statusLabel: "Payout blocked",
    title: "Missing invoice from contractor",
    body: "March payout for Studio Promenade is ready (€1,140 to owner) but invoice from contractor Sophie R. (22 Mar) is missing. Owner M. Laurent's payout is on hold.",
    agentDid: "Flagged missing invoice. Sophie normally submits within 48hrs.",
    action: "Contact contractor or Exclude cost",
    property: "Studio Promenade",
    address: "45 Promenade des Anglais",
    resolved: false,
  },
  {
    id: 4,
    time: "08:50",
    agent: "Maintenance",
    agentColor: COLORS.purple,
    type: "auto",
    urgency: "none",
    statusLabel: "Inspection logged",
    title: "Post-checkout inspection — Maison Cimiez",
    body: "Ran photo checklist against listing standard. All 14 items passed. Minor note: bathroom towel rack slightly loose — added to low-priority maintenance queue.",
    agentDid: "Compared 14 checklist photos to baseline. Flagged towel rack for next maintenance window.",
    property: "Maison Cimiez",
    resolved: true,
  },
  {
    id: 5,
    time: "08:40",
    agent: "Finance",
    agentColor: COLORS.green,
    type: "auto",
    urgency: "none",
    statusLabel: "Payout calculated",
    title: "Owner payout calculated — Villa Roses",
    body: "Mme. Moreau payout for June: €980 (revenue €1,520 − commission €228 − cleaning €180 − supplies €132). Bank transfer queued.",
    agentDid: "Verified 3 invoices, applied 15% commission rate, queued transfer.",
    property: "Villa Roses",
    resolved: true,
  },
  {
    id: 6,
    time: "08:15",
    agent: "Guest Comms",
    agentColor: COLORS.blue,
    type: "auto",
    urgency: "none",
    statusLabel: "Check-in sent",
    title: "Check-in instructions sent",
    body: "Sent check-in details to 4 arriving guests: Villa Roses (15:00), Maison Cimiez (16:00), Apt. Port (16:00), Studio Vieux Nice (17:00). Lockbox codes updated.",
    agentDid: "Generated personalized welcome messages in French, updated 4 lockbox codes.",
    property: "4 properties",
    resolved: true,
  },
  {
    id: 7,
    time: "08:00",
    agent: "Supervisor",
    agentColor: COLORS.textSecondary,
    type: "auto",
    urgency: "none",
    statusLabel: "Schedule ready",
    title: "Today's schedule generated",
    body: "6 turnovers today. 5 cleaners confirmed. 1 pending (Villa Mimosa — see escalation above). All properties have sufficient time gaps.",
    agentDid: "Coordinated Operations and Guest Comms agents. Cross-referenced bookings, cleaner availability, and travel times. Confirmed 5/6.",
    property: "All properties",
    resolved: true,
  },
  {
    id: 8,
    time: "07:45",
    agent: "Guest Comms",
    agentColor: COLORS.blue,
    type: "auto",
    urgency: "none",
    statusLabel: "Messages handled",
    title: "7 overnight messages handled",
    body: "3 WiFi questions, 2 restaurant recommendations, 1 checkout reminder, 1 parking question. All answered automatically, no escalations.",
    agentDid: "Matched each message to knowledge base. Average response time: 2 min.",
    property: "Multiple properties",
    resolved: true,
  },
  {
    id: 9,
    time: "07:30",
    agent: "Operations",
    agentColor: COLORS.accent,
    type: "auto",
    urgency: "none",
    statusLabel: "Inventory checked",
    title: "Supply levels verified",
    body: "Checked linen and consumable stock across all properties. Apt. Port and Studio Vieux Nice are low on coffee pods — reorder triggered.",
    agentDid: "Scanned inventory tracker, placed auto-order for 4 boxes of coffee pods (€48).",
    property: "Apt. Port, Studio Vieux Nice",
    resolved: true,
  },
  {
    id: 10,
    time: "07:15",
    agent: "Finance",
    agentColor: COLORS.green,
    type: "auto",
    urgency: "none",
    statusLabel: "Rates adjusted",
    title: "Dynamic pricing update",
    body: "Adjusted nightly rates for 3 properties based on demand and competitor analysis. Villa Paradiso +12% (high demand week), Apt. Gambetta −8% (low occupancy).",
    agentDid: "Analyzed 14 competitor listings, local event calendar, and booking pace.",
    property: "3 properties",
    resolved: true,
  },
  {
    id: 11,
    time: "07:00",
    agent: "Maintenance",
    agentColor: COLORS.purple,
    type: "auto",
    urgency: "none",
    statusLabel: "Preventive check",
    title: "Scheduled maintenance reminder sent",
    body: "Sent reminders for 2 upcoming maintenance tasks: Villa Mimosa boiler service (due Jul 12), Apt. Libération smoke detector battery (due Jul 8).",
    agentDid: "Cross-checked maintenance calendar. Notified contractors with property access details.",
    property: "Villa Mimosa, Apt. Libération",
    resolved: true,
  },
  {
    id: 12,
    time: "06:30",
    agent: "Guest Comms",
    agentColor: COLORS.blue,
    type: "auto",
    urgency: "none",
    statusLabel: "Reviews monitored",
    title: "New reviews scanned",
    body: "2 new reviews overnight: Maison Cimiez 5★ ('Spotless, amazing host'), Villa Paradiso 4★ ('Great location, noisy street'). Portfolio average: 4.72★.",
    agentDid: "Logged reviews, updated portfolio average. Drafted thank-you reply for Maison Cimiez.",
    property: "Maison Cimiez, Villa Paradiso",
    resolved: true,
  },
  {
    id: 13,
    time: "06:00",
    agent: "Operations",
    agentColor: COLORS.accent,
    type: "auto",
    urgency: "none",
    statusLabel: "Synced",
    title: "Calendar sync completed",
    body: "Synced bookings across Airbnb, Booking.com, and Google Calendar. No conflicts detected. 3 new bookings imported (Jul 8–15).",
    agentDid: "Pulled data from 3 platforms, resolved 0 overlaps, updated internal calendar.",
    property: "All properties",
    resolved: true,
  },
];

// ─── Finance-specific Activity ───
const financeActivityMessages = [
  {
    id: 101,
    time: "09:30",
    agent: "Finance",
    agentColor: COLORS.green,
    type: "alert",
    urgency: "medium",
    statusLabel: "Payout blocked",
    title: "Missing invoice from contractor",
    body: "March payout for Studio Promenade (€1,140 to M. Laurent) on hold — invoice from contractor Sophie R. (€180, due 22 Mar) is missing.",
    agentDid: "Flagged missing invoice. Sophie normally submits within 48hrs. Sent reminder.",
    action: "Contact contractor or Exclude cost",
    property: "Studio Promenade",
    address: "45 Promenade des Anglais",
    resolved: false,
  },
  {
    id: 102,
    time: "09:00",
    agent: "Finance",
    agentColor: COLORS.green,
    type: "alert",
    urgency: "medium",
    statusLabel: "Overdue invoice",
    title: "Overdue invoice — Apt. Masséna",
    body: "Cleaning invoice from 28 Mar (€180, cleaner: Marc R.) is 10 days overdue. This blocks the owner payout for M. Bernard (€890).",
    agentDid: "Sent 2 reminders to Marc R. Last reminder: yesterday. No response yet.",
    action: "Escalate to owner?",
    property: "Apt. Masséna",
    address: "30 Av. Jean Médecin",
    resolved: false,
  },
  {
    id: 103,
    time: "09:10",
    agent: "Finance",
    agentColor: COLORS.green,
    type: "auto",
    urgency: "none",
    statusLabel: "Report ready",
    title: "June monthly report generated",
    body: "Revenue: €31,240 (+12% vs May). Net profit: €22,510 (+16%). Commission earned: €6,248. Growth driven by higher villa occupancy.",
    agentDid: "Compiled revenue, expenses, and profit data across all 35 properties.",
    property: "All properties",
    resolved: true,
  },
  {
    id: 104,
    time: "08:50",
    agent: "Finance",
    agentColor: COLORS.green,
    type: "auto",
    urgency: "none",
    statusLabel: "Payout sent",
    title: "1 payout processed — Studio Promenade",
    body: "Owner payout for M. Laurent (€1,140) has been processed. Cleaning invoice (€180) deducted, 20% commission applied. Bank transfer initiated.",
    agentDid: "Deducted verified expenses, applied commission rate, and queued transfer to M. Laurent's account.",
    property: "Studio Promenade",
    resolved: true,
  },
  {
    id: 105,
    time: "08:30",
    agent: "Finance",
    agentColor: COLORS.green,
    type: "auto",
    urgency: "none",
    statusLabel: "Invoice received",
    title: "Invoice received — Sophie R.",
    body: "Sophie R. submitted the missing cleaning invoice (€180) for Studio Promenade. Amount matches expected rate. Invoice verified and matched to booking.",
    agentDid: "Received and validated invoice. Matched to booking record and contractor agreement. Payout for M. Laurent is now unblocked.",
    property: "Studio Promenade",
    resolved: true,
  },
  {
    id: 106,
    time: "08:15",
    agent: "Finance",
    agentColor: COLORS.green,
    type: "auto",
    urgency: "none",
    statusLabel: "Contractor contacted",
    title: "Contacted contractor for missing invoice",
    body: "Sophie R. has a missing invoice (€180) for Studio Promenade cleaning on 22 Mar. Sent automated reminder requesting submission within 48hrs.",
    agentDid: "Identified missing invoice blocking M. Laurent's payout. Sent reminder to Sophie R. via email and SMS.",
    property: "Studio Promenade",
    resolved: true,
  },
  {
    id: 107,
    time: "08:00",
    agent: "Finance",
    agentColor: COLORS.green,
    type: "auto",
    urgency: "none",
    statusLabel: "Payouts sent",
    title: "35 owner payments processed",
    body: "Processed monthly owner payouts for 35 properties. Total disbursed: €48,720. All invoices verified, commissions deducted, bank transfers initiated.",
    agentDid: "Verified 102 invoices across 35 properties, applied commission rates, and queued bank transfers.",
    property: "35 properties",
    resolved: true,
  },
];

// ─── Agents Data ───
const agentsData = [
  {
    id: "operations",
    name: "Operations Agent",
    icon: "⚡",
    color: COLORS.accent,
    colorLight: COLORS.accentLight,
    status: "active",
    description: "Manages daily turnovers, cleaner scheduling, and property logistics. Automatically coordinates check-ins, check-outs, and handles scheduling conflicts.",
    category: "Core",
    actionsToday: 6,
    actionsTotal: 1247,
    accuracy: 96,
    lastActive: "2 min ago",
    propertiesManaged: 35,
    tasks: [
      { name: "Send check-in instructions", mode: "auto", description: "Automatically sends check-in details, lockbox codes, and welcome info to guests before arrival.", escalations: ["Guest arrives with no instructions sent → Send emergency instructions + notify"], thresholds: { sendCheckinHoursBefore: 4, language: "French" } },
      { name: "Confirm scheduled cleaners", mode: "auto", description: "Verifies cleaner availability and confirms assignments for each turnover.", escalations: ["Cleaner cancels within 4hrs of turnover → Find backup + escalate for approval"], thresholds: { maxCleanerDistance: "30 km" } },
      { name: "Generate daily schedule", mode: "auto", description: "Creates the day's turnover schedule based on check-ins, check-outs, and cleaner availability.", escalations: ["Check-in gap < 90 minutes → Alert operator immediately"], thresholds: { scheduleBuffer: "90 min" } },
      { name: "Assign backup cleaners", mode: "approval", description: "When a cleaner cancels, finds the best available backup from the pool and requests approval.", escalations: ["No backup available within range → Escalate immediately to operator"], thresholds: { maxCleanerDistance: "30 km" } },
      { name: "Reschedule turnovers", mode: "approval", description: "Adjusts turnover timing when delays or conflicts arise. Checks downstream impact before proposing.", escalations: ["Reschedule creates < 90min buffer → Flag as risky"], thresholds: { scheduleBuffer: "90 min" } },
      { name: "Cancel a booking", mode: "disabled", description: "Cancelling bookings is restricted to manual operator action only.", escalations: [], thresholds: {} },
    ],
    integrations: [
      { name: "Airbnb", status: "connected" },
      { name: "Booking.com", status: "connected" },
      { name: "Google Calendar", status: "connected" },
      { name: "Slack", status: "connected" },
      { name: "CleanerApp", status: "connected" },
    ],
    managedProperties: [
      { name: "Villa Mimosa", status: "crisis" },
      { name: "Maison Cimiez", status: "ok" },
      { name: "Studio Promenade", status: "ok" },
      { name: "Villa Roses", status: "ok" },
      { name: "Villa Paradiso", status: "crisis" },
      { name: "Studio Vieux Nice", status: "action" },
    ],
    recentActions: [
      { time: "09:15", action: "Found backup cleaner for Villa Mimosa", status: "escalated" },
      { time: "08:15", action: "Sent check-in instructions to 4 guests", status: "auto" },
      { time: "08:00", action: "Generated today's schedule (6 turnovers)", status: "auto" },
      { time: "07:30", action: "Confirmed 5 cleaners for today", status: "auto" },
      { time: "Yesterday", action: "Rescheduled Apt. Port cleaning (+2hrs)", status: "auto" },
    ],
    chatSuggestions: [
      "What's the turnover schedule for today?",
      "Which cleaners are available this afternoon?",
      "Reschedule Villa Mimosa cleaning to 11:00",
      "Show properties with tight turnover windows",
    ],
    sampleResponses: {
      "What's the turnover schedule for today?": "Today's turnover schedule:\n\n• 10:00 — Villa Mimosa (checkout) → Léa cleaning 10:30–14:30 → check-in 16:00\n• 10:00 — Maison Cimiez (checkout) → Sophie cleaning 10:30–13:00 → check-in 16:00\n• 10:00 — Studio Promenade (checkout) → Marc cleaning 10:30–12:00 → check-in 15:00\n• 11:00 — Apt. Port (checkout) → no incoming guest today\n• 11:00 — Studio Vieux Nice (checkout) → Marc cleaning 12:30–14:00 → check-in 15:00\n\n5 of 6 cleaners confirmed. Villa Mimosa is using backup cleaner (Léa) — awaiting your approval.",
      "Which cleaners are available this afternoon?": "Available cleaners this afternoon:\n\n• Sophie R. — free after 13:00 (finishing Maison Cimiez)\n• Marc D. — free after 14:00 (finishing Studio Vieux Nice)\n• Léa M. — free after 14:30 (finishing Villa Mimosa, if approved)\n• Thomas B. — available all afternoon (no bookings today)\n\nWant me to assign someone to a specific property?",
    },
  },
  {
    id: "communications",
    name: "Communications Agent",
    icon: "💬",
    color: COLORS.blue,
    colorLight: COLORS.blueLight,
    status: "active",
    description: "Handles all guest communication including check-in instructions, FAQ responses, restaurant recommendations, and issue escalation. Responds in guest's preferred language.",
    category: "Core",
    actionsToday: 11,
    actionsTotal: 3842,
    accuracy: 98,
    lastActive: "5 min ago",
    propertiesManaged: 35,
    tasks: [
      { name: "Reply to FAQ questions", mode: "auto", description: "Handles common guest questions like WiFi, parking, restaurants, and local tips automatically.", escalations: ["No response from guest after 2 attempts → Flag as unresponsive"], thresholds: { responseDelay: "2 min", tone: "Friendly & professional", includeLocalTips: true } },
      { name: "Send check-in instructions", mode: "auto", description: "Sends arrival details, lockbox codes, and property info before guest check-in.", escalations: ["Guest requests early check-in → Check with Operations Agent"], thresholds: { sendCheckinHoursBefore: 4, language: "Auto-detect" } },
      { name: "Recommend restaurants/activities", mode: "auto", description: "Provides curated local recommendations based on guest preferences and property location.", escalations: [], thresholds: { includeLocalTips: true } },
      { name: "Handle complaint first response", mode: "auto", description: "Acknowledges guest complaints immediately and routes to the appropriate agent.", escalations: ["Guest complaint mentions safety → Escalate immediately to operator", "Negative sentiment detected → Alert operator + draft response"], thresholds: { responseDelay: "2 min" } },
      { name: "Offer refunds or compensation", mode: "approval", description: "Proposes compensation when guest experience is impacted. Requires operator approval.", escalations: ["Compensation request > €100 → Escalate to operator"], thresholds: {} },
      { name: "Draft negative review responses", mode: "approval", description: "Creates professional responses to negative reviews for operator review before publishing.", escalations: ["Review mentions legal/safety issue → Escalate immediately"], thresholds: {} },
    ],
    recentActions: [
      { time: "09:10", action: "Responded to parking question (Villa Roses)", status: "auto" },
      { time: "08:47", action: "Escalated AC complaint (Apt. Garibaldi)", status: "escalated" },
      { time: "08:15", action: "Sent check-in details to 4 arriving guests", status: "auto" },
      { time: "07:45", action: "Handled 7 overnight messages", status: "auto" },
      { time: "Yesterday", action: "Drafted review response for Apt. Port", status: "escalated" },
    ],
    chatSuggestions: [
      "How many guest messages today?",
      "What did the Garibaldi guest say?",
      "Draft a welcome message for Villa Roses",
      "Show unresolved guest conversations",
    ],
    sampleResponses: {
      "How many guest messages today?": "Today's guest communication summary:\n\n• 11 messages handled (7 overnight + 4 this morning)\n• 0 unresolved conversations\n• 4 check-in instructions sent\n• 1 escalation (Apt. Garibaldi AC issue → Maintenance Agent)\n\nBreakdown by type:\n— WiFi/tech questions: 3\n— Restaurant recommendations: 2\n— Check-in logistics: 4\n— Complaints: 1 (AC)\n— Parking: 1",
      "What did the Garibaldi guest say?": "Apt. Garibaldi guest (Mr. Chen, staying nights 3–5):\n\nMessage at 08:47: \"The air conditioning stopped working overnight, it was very hot.\"\n\nI responded at 08:49: \"I'm sorry about the inconvenience, Mr. Chen. I've alerted our maintenance team and they're arranging a repair visit today. I'll update you with a specific time shortly.\"\n\nThis was escalated to Maintenance Agent who found 2 contractors. The guest hasn't messaged again since.",
    },
    integrations: [
      { name: "Airbnb Messaging", status: "connected" },
      { name: "Booking.com Inbox", status: "connected" },
      { name: "WhatsApp Business", status: "connected" },
      { name: "Google Translate", status: "connected" },
      { name: "VRBO", status: "disconnected" },
    ],
    managedProperties: [
      { name: "Apt. Garibaldi", status: "action" },
      { name: "Apt. Libération", status: "ok" },
      { name: "Villa Roses", status: "ok" },
      { name: "Apt. Port", status: "action" },
      { name: "Villa Paradiso", status: "crisis" },
    ],
  },
  {
    id: "maintenance",
    name: "Maintenance Agent",
    icon: "🔧",
    color: COLORS.purple,
    colorLight: COLORS.purpleLight,
    status: "active",
    description: "Coordinates property maintenance, emergency repairs, and contractor scheduling. Maintains a vetted contractor network and tracks repair history per property.",
    category: "Core",
    actionsToday: 3,
    actionsTotal: 587,
    accuracy: 94,
    lastActive: "12 min ago",
    propertiesManaged: 35,
    tasks: [
      { name: "Dispatch emergency contractors", mode: "auto", description: "Automatically contacts and dispatches contractors for urgent issues like water leaks, gas, or electrical.", escalations: ["Emergency (water, gas, electrical) → Auto-dispatch + notify operator", "Contractor unavailable for emergency → Try backup list, then escalate"], thresholds: { preferredContractors: "Dupont HVAC, Côte Plomberie, CleanPro" } },
      { name: "Order supplies under €100", mode: "auto", description: "Purchases replacement supplies and small items without requiring approval.", escalations: [], thresholds: {} },
      { name: "Schedule preventive checks", mode: "auto", description: "Plans and coordinates routine property inspections on a recurring schedule.", escalations: ["Repeat issue at same property (3x) → Flag for root cause review"], thresholds: { preventiveCheckInterval: "Monthly" } },
      { name: "Approve repairs over €100", mode: "approval", description: "Repairs exceeding the auto-approve budget require operator sign-off.", escalations: ["Repair cost exceeds €200 → Get operator approval before proceeding"], thresholds: {} },
      { name: "Authorize structural work", mode: "disabled", description: "Structural modifications are restricted to manual operator coordination only.", escalations: [], thresholds: {} },
      { name: "Contact property owners", mode: "approval", description: "Reaches out to owners about maintenance issues affecting their property.", escalations: ["Repair cost exceeds €200 → Notify owner"], thresholds: {} },
    ],
    recentActions: [
      { time: "09:02", action: "Found 2 AC contractors for Apt. Garibaldi", status: "escalated" },
      { time: "08:30", action: "Dispatched plumber for Apt. Masséna water leak", status: "escalated" },
      { time: "Yesterday", action: "Completed preventive check on Villa Paradiso", status: "auto" },
      { time: "Yesterday", action: "Ordered replacement light fixtures for Studio Vieux Nice", status: "auto" },
    ],
    chatSuggestions: [
      "Any open maintenance issues?",
      "What contractors are available today?",
      "Schedule preventive check for Villa Mimosa",
      "Show repair history for Apt. Masséna",
    ],
    sampleResponses: {
      "Any open maintenance issues?": "Currently 2 open maintenance issues:\n\n1. Apt. Garibaldi — AC failure\n   Dupont HVAC available today 14:00 (€120). Awaiting your approval.\n\n2. Apt. Masséna — Water leak\n   Emergency plumber dispatched (ETA 09:45). Guest notified.\n\nAll other properties have no outstanding maintenance requests. Next scheduled preventive check: Villa Roses on Jul 8.",
      "What contractors are available today?": "Available contractors today:\n\n• Dupont HVAC — available 14:00+ (speciality: AC, heating)\n• Côte Plomberie — on call (currently dispatched to Apt. Masséna)\n• ElectroPro — available all day (speciality: electrical)\n• CleanPro — available 11:00+ (speciality: deep cleaning, damage repair)\n• SerruriNice — available on 2hr notice (speciality: locks, security)\n\nWant me to book any of them?",
    },
    integrations: [
      { name: "Contractor Network API", status: "connected" },
      { name: "Slack", status: "connected" },
      { name: "Property Inventory DB", status: "connected" },
      { name: "Stripe (payments)", status: "connected" },
    ],
    managedProperties: [
      { name: "Apt. Garibaldi", status: "action" },
      { name: "Apt. Masséna", status: "crisis" },
      { name: "Villa Paradiso", status: "ok" },
      { name: "Studio Vieux Nice", status: "ok" },
    ],
  },
  {
    id: "finance",
    name: "Finance Agent",
    icon: "📊",
    color: COLORS.green,
    colorLight: COLORS.greenLight,
    status: "active",
    description: "Tracks revenue, expenses, owner payouts, and invoices. Generates financial reports, detects anomalies, and suggests cost optimizations across the portfolio.",
    category: "Core",
    actionsToday: 4,
    actionsTotal: 892,
    accuracy: 99,
    lastActive: "8 min ago",
    propertiesManaged: 35,
    tasks: [
      { name: "Generate monthly reports", mode: "auto", description: "Compiles revenue, expenses, and profit data into monthly summaries for each property.", escalations: ["Revenue anomaly detected (>20% swing) → Generate alert report"], thresholds: { currency: "EUR", taxRate: "20%" } },
      { name: "Send invoice reminders", mode: "auto", description: "Automatically follows up on missing or overdue invoices from contractors and cleaners.", escalations: ["Invoice overdue > 7 days → Send second reminder + flag operator"], thresholds: { invoiceReminderDays: 3 } },
      { name: "Process owner payouts", mode: "auto", description: "Calculates and processes monthly owner payouts based on revenue minus expenses.", escalations: ["Payout blocked > 48hrs → Escalate to operator"], thresholds: { payoutSchedule: "End of month" } },
      { name: "Hold payouts for missing docs", mode: "auto", description: "Automatically freezes payouts when required documentation is incomplete.", escalations: ["Owner disputes a charge → Freeze payout + escalate"], thresholds: {} },
      { name: "Approve payouts over €5,000", mode: "approval", description: "Large payouts require operator review before processing.", escalations: [], thresholds: {} },
      { name: "Issue refunds", mode: "approval", description: "Guest refunds must be reviewed and approved by the operator.", escalations: [], thresholds: {} },
    ],
    recentActions: [
      { time: "08:30", action: "Flagged missing invoice from contractor — Studio Promenade payout blocked", status: "escalated" },
      { time: "08:00", action: "Generated June monthly report", status: "auto" },
      { time: "Yesterday", action: "Detected competitor price drop for Apt. Gambetta", status: "escalated" },
      { time: "Yesterday", action: "Processed 8 owner payouts (€18,220)", status: "auto" },
    ],
    chatSuggestions: [
      "Show this month's revenue breakdown",
      "Any overdue invoices?",
      "Forecast for next quarter",
      "Which properties are underperforming?",
    ],
    sampleResponses: {
      "Show this month's revenue breakdown": "June 2025 Revenue Breakdown:\n\nTotal: €31,240 (+12% vs May)\n\nBy property:\n1. Maison Cimiez — €7,560 (24%)\n2. Villa Mimosa — €4,870 (16%)\n3. Villa Paradiso — €3,600 (12%)\n4. Apt. Garibaldi — €3,060 (10%)\n5. Villa Roses — €3,040 (10%)\n6. Others — €9,110 (29%)\n\nCommission earned: €6,248 (20% avg rate)\nNet profit: €22,510 (+16% vs May)",
      "Any overdue invoices?": "2 overdue invoices:\n\n1. Sophie R. — €180 (cleaning, Studio Promenade, 22 Mar)\n   Status: Reminder sent yesterday, no response yet\n   Impact: Blocking M. Laurent's payout (€1,820)\n\n2. Côte Clim — €95 (AC service, Apt. Port, 15 Jun)\n   Status: First reminder sent today\n   Impact: Minor — payout already processed\n\nTotal overdue: €360. Want me to send follow-up reminders?",
    },
    integrations: [
      { name: "Stripe", status: "connected" },
      { name: "QuickBooks", status: "connected" },
      { name: "Airbnb Payouts", status: "connected" },
      { name: "Booking.com Finance", status: "connected" },
      { name: "Google Sheets (reports)", status: "connected" },
    ],
    managedProperties: [
      { name: "Studio Promenade", status: "action" },
      { name: "Apt. Masséna", status: "action" },
      { name: "Apt. Gambetta", status: "action" },
      { name: "Apt. Port", status: "action" },
      { name: "Maison Cimiez", status: "ok" },
      { name: "Villa Mimosa", status: "ok" },
    ],
  },
  {
    id: "supervisor",
    name: "Supervisor Agent",
    icon: "👁",
    color: COLORS.yellow,
    colorLight: COLORS.yellowLight,
    status: "active",
    description: "Oversees all other agents, monitors performance, resolves conflicts between agents, and escalates critical decisions. Ensures the entire system operates smoothly and within defined guardrails.",
    category: "Core",
    actionsToday: 8,
    actionsTotal: 2134,
    accuracy: 97,
    lastActive: "1 min ago",
    propertiesManaged: 35,
    tasks: [
      { name: "Monitor agent performance", mode: "auto", description: "Tracks accuracy, response times, and escalation rates for all agents. Flags anomalies.", escalations: ["Agent accuracy drops below 90% → Alert operator + suggest review"], thresholds: { minAccuracy: "90%", maxResponseTime: "5 min" } },
      { name: "Resolve inter-agent conflicts", mode: "auto", description: "When two agents produce conflicting actions or recommendations, applies priority rules to resolve.", escalations: ["Unresolvable conflict → Escalate to operator with both options"], thresholds: {} },
      { name: "Generate daily summary", mode: "auto", description: "Compiles a daily briefing of all agent activity, key decisions, and items needing attention.", escalations: [], thresholds: { summaryTime: "08:00" } },
      { name: "Override agent decisions", mode: "approval", description: "Can override any agent's automated action when it detects a potential issue. Requires operator approval.", escalations: ["Critical override needed → Escalate immediately"], thresholds: {} },
      { name: "Pause/resume agents", mode: "approval", description: "Can temporarily pause or resume any agent based on operational needs.", escalations: [], thresholds: {} },
      { name: "Modify agent rules", mode: "disabled", description: "Changes to agent escalation rules and thresholds are restricted to operator-only.", escalations: [], thresholds: {} },
    ],
    recentActions: [
      { time: "09:20", action: "Resolved scheduling conflict between Operations and Maintenance agents", status: "auto" },
      { time: "08:00", action: "Generated daily briefing — 3 items need attention", status: "auto" },
      { time: "07:45", action: "Flagged Communications Agent response time increase", status: "escalated" },
      { time: "Yesterday", action: "Compiled weekly agent performance report", status: "auto" },
    ],
    chatSuggestions: [
      "How are all agents performing today?",
      "Any conflicts between agents?",
      "Show the daily briefing",
      "Which agents need attention?",
    ],
    sampleResponses: {
      "How are all agents performing today?": "Agent Performance Summary (today):\n\n• Operations Agent — 96% accuracy, 6 actions, all on time ✅\n• Communications Agent — 98% accuracy, 11 actions, 1 escalation ✅\n• Maintenance Agent — 94% accuracy, 3 actions, 2 escalations ⚠️\n• Finance Agent — 99% accuracy, 4 actions, 1 payout blocked ⚠️\n• Supervisor (me) — monitoring all, 1 conflict resolved\n\nOverall system health: Good. 2 items need your attention:\n1. Maintenance: AC repair approval needed (Apt. Garibaldi, €120)\n2. Finance: Missing invoice blocking Studio Promenade payout",
      "Any conflicts between agents?": "1 conflict resolved today:\n\nOperations scheduled a cleaner at Villa Mimosa at 10:30, but Maintenance had booked an AC inspection for the same time slot. I rescheduled the inspection to 14:00 (after cleaning completes).\n\nNo active conflicts. All agents are operating within normal parameters.",
    },
    integrations: [
      { name: "All Agent APIs", status: "connected" },
      { name: "Slack (alerts)", status: "connected" },
      { name: "Dashboard Analytics", status: "connected" },
    ],
    managedProperties: [
      { name: "All properties", status: "ok" },
    ],
  },
  {
    id: "reviews",
    name: "Reviews Agent",
    icon: "⭐",
    color: "#c47f17",
    colorLight: COLORS.yellowLight,
    status: "paused",
    description: "Monitors guest reviews across all platforms, drafts professional responses, and identifies recurring issues. Can suggest operational improvements based on feedback patterns.",
    category: "Optimization",
    actionsToday: 0,
    actionsTotal: 156,
    accuracy: 93,
    lastActive: "2 days ago",
    propertiesManaged: 35,
    tasks: [
      { name: "Auto-respond to 4–5 star reviews", mode: "auto", description: "Sends a professional thank-you response to positive reviews across all platforms.", escalations: [], thresholds: { responseTimeTarget: "24 hours" } },
      { name: "Monitor new reviews", mode: "auto", description: "Watches all connected platforms for new guest reviews and flags notable ones.", escalations: ["Review below 3 stars → Draft response + alert operator", "Property rating drops below 4.5 → Generate improvement report"], thresholds: { alertOnBelowRating: 3 } },
      { name: "Detect sentiment patterns", mode: "auto", description: "Analyzes review text to identify recurring complaints or praise across properties.", escalations: ["Same issue mentioned 3+ times → Flag recurring pattern"], thresholds: {} },
      { name: "Draft responses to negative reviews", mode: "approval", description: "Creates professional, empathetic responses to negative reviews for operator review.", escalations: ["Review mentions legal/safety issue → Escalate immediately"], thresholds: { responseTimeTarget: "24 hours" } },
      { name: "Publish review responses", mode: "approval", description: "Posts approved responses to the review platforms.", escalations: [], thresholds: {} },
      { name: "Offer compensation to reviewers", mode: "disabled", description: "Compensation offers to reviewers are restricted to manual operator action.", escalations: [], thresholds: {} },
    ],
    recentActions: [
      { time: "2 days ago", action: "Drafted response for 2-star review (Apt. Port)", status: "escalated" },
      { time: "3 days ago", action: "Auto-responded to 5-star review (Villa Mimosa)", status: "auto" },
      { time: "4 days ago", action: "Flagged recurring noise complaint pattern (Apt. Port)", status: "escalated" },
    ],
    chatSuggestions: [
      "Show recent negative reviews",
      "What's our average rating trend?",
      "Any recurring complaints?",
      "Draft a response for the Apt. Port review",
    ],
    sampleResponses: {
      "Show recent negative reviews": "Recent negative reviews (below 4 stars):\n\n1. Apt. Port — ⭐⭐ (2 days ago)\n   \"Street noise was unbearable and WiFi kept dropping.\"\n   Status: Response drafted, awaiting your approval\n\n2. Apt. Masséna — ⭐⭐⭐ (1 week ago)\n   \"Nice location but the apartment felt dated. Water pressure was low.\"\n   Status: Responded with acknowledgment + mention of planned renovation\n\nOverall portfolio rating: 4.7 (stable). Apt. Port has dropped from 4.6 to 4.4 over 3 months — noise is a recurring theme (mentioned in 4 of last 8 reviews).",
    },
    integrations: [
      { name: "Airbnb Reviews", status: "connected" },
      { name: "Booking.com Reviews", status: "connected" },
      { name: "VRBO Reviews", status: "disconnected" },
      { name: "Google Business", status: "disconnected" },
    ],
    managedProperties: [
      { name: "Apt. Port", status: "action" },
      { name: "Apt. Masséna", status: "action" },
      { name: "Villa Mimosa", status: "ok" },
      { name: "Maison Cimiez", status: "ok" },
    ],
  },
];

// ─── Components ───

const getAgentColor = (agent) =>
  agent.includes("Operations") ? COLORS.accent
  : agent.includes("Maintenance") ? COLORS.purple
  : agent.includes("Finance") ? COLORS.green
  : COLORS.blue;

const Badge = ({ label, bg, color, border }) => (
  <span style={{
    fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 5,
    backgroundColor: bg, color, border: `1px solid ${border || color}20`,
    whiteSpace: "nowrap",
  }}>
    {label}
  </span>
);

const AiButton = ({ onClick }) => (
  <button
    onClick={onClick}
    style={{
      width: 28, height: 28, borderRadius: 6,
      border: "none",
      backgroundColor: "transparent",
      cursor: "pointer",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 20, color: COLORS.accent,
      flexShrink: 0,
    }}
    title="Ask agent about this"
  >
    ✦
  </button>
);

// ─── Unified Property Card ───
const PropertyCard = ({ property, onAskAgent, expanded, onToggleExpand, handleDone, onHandleIt, fadingOut, onApproveAction }) => {
  const [actionDone, setActionDone] = useState(false);

  const isCritical = property.urgency === "high";
  const isImportant = property.urgency === "medium";
  const agentColor = getAgentColor(property.agent);
  const borderColor = isCritical ? COLORS.red : COLORS.border;
  const needsAction = isCritical || isImportant;

  const l = property.listing;

  return (
    <div
      onClick={() => needsAction && onToggleExpand?.(property.id)}
      style={{
        gridColumn: expanded ? "1 / -1" : "span 1",
        backgroundColor: isCritical ? "#fff8f7" : COLORS.white,
        borderRadius: 12,
        border: `1.5px solid ${borderColor}`,
        padding: expanded ? "20px 24px" : "16px 18px",
        display: "flex", flexDirection: "column", gap: expanded ? 10 : 10,
        boxSizing: "border-box",
        overflow: "hidden",
        cursor: needsAction ? "pointer" : "default",
        transition: "all 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
        opacity: fadingOut ? 0 : 1,
        transform: fadingOut ? "scale(0.95)" : "scale(1)",
        boxShadow: expanded ? "0 8px 24px rgba(0,0,0,0.08)" : "none",
      }}
    >
      {/* Row 1: Urgency badges + AI button */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        {isCritical && <Badge label="Critical ⚠" bg={COLORS.redLight} color={COLORS.red} />}
        {isImportant && <Badge label="Important" bg={COLORS.yellowLight} color={COLORS.yellow} />}
        <Badge label={property.statusLabel} bg={COLORS.bg} color={COLORS.text} />
        {property.approvedAction && <Badge label="✓ Approved" bg={COLORS.greenLight} color={COLORS.green} />}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
          {needsAction && (
            <button
              onClick={(e) => { e.stopPropagation(); onToggleExpand?.(property.id); }}
              style={{
                width: 24, height: 24, borderRadius: 5,
                border: `1px solid ${COLORS.border}`, backgroundColor: COLORS.bg,
                color: COLORS.textSecondary, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, lineHeight: 1, padding: 0,
              }}
              title={expanded ? "Collapse" : "Expand"}
            >
              {expanded ? "⤡" : "⤢"}
            </button>
          )}
          <AiButton onClick={(e) => { e.stopPropagation(); onAskAgent?.(property); }} />
        </div>
      </div>

      {/* Row 2: Name */}
      <div style={{ fontWeight: 700, fontSize: expanded ? 18 : 16, color: COLORS.text, transition: "font-size 0.3s ease" }}>{property.name}</div>

      {/* Row 3: Address · nights · guests · price */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: COLORS.textSecondary, flexWrap: "wrap" }}>
        <span>{property.address}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 3 }}>☾ {property.nights}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 3 }}>👥 {property.occupants}</span>
        <span style={{ fontWeight: 600, color: COLORS.text }}>€{property.price.replace("€", "")}</span>
      </div>

      {/* Row 4: Detail */}
      <div style={{ fontSize: 12.5, color: COLORS.text, lineHeight: 1.5 }}>
        {property.detail}
      </div>

      {/* Row 5: Agent */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: agentColor, flexShrink: 0 }} />
        <span style={{ fontSize: 11, color: COLORS.textSecondary }}>{property.agent.replace(" Agent", "")}</span>
      </div>

      {/* Action buttons — shown here only when collapsed */}
      <div style={{
        display: "flex", gap: 8, flexWrap: "wrap", marginTop: "auto",
        maxHeight: expanded ? 0 : 60,
        opacity: expanded ? 0 : 1,
        overflow: "hidden",
        transition: expanded
          ? "max-height 0.1s ease, opacity 0.05s ease"
          : "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.15s, opacity 0.35s ease 0.2s",
      }}>
        {property.actionLabel && !actionDone && (
          <button
            onClick={(e) => { e.stopPropagation(); setActionDone(true); onApproveAction?.(property.id); }}
            style={{
              fontSize: 12, fontWeight: 600, padding: "8px 18px", borderRadius: 6,
              border: "none", backgroundColor: COLORS.text, color: COLORS.white, cursor: "pointer",
            }}
          >
            {property.actionLabel}
          </button>
        )}
        {property.actionLabel2 && !actionDone && (
          <button
            onClick={(e) => { e.stopPropagation(); setActionDone(true); onApproveAction?.(property.id); }}
            style={{
              fontSize: 12, fontWeight: 600, padding: "8px 18px", borderRadius: 6,
              border: `1px solid ${COLORS.border}`, backgroundColor: COLORS.white, color: COLORS.text, cursor: "pointer",
            }}
          >
            {property.actionLabel2}
          </button>
        )}
        {actionDone && (property.actionLabel || property.actionLabel2) && (
          <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.green, padding: "8px 0" }}>✓ Done</span>
        )}
        {needsAction && !handleDone && (
          <button
            onClick={(e) => { e.stopPropagation(); onHandleIt(property.id); }}
            style={{
              fontSize: 12, fontWeight: 500, padding: "8px 18px", borderRadius: 6,
              border: `1px solid ${COLORS.border}`, backgroundColor: "transparent",
              color: COLORS.text, cursor: "pointer",
            }}
          >
            I'll handle it
          </button>
        )}
        {handleDone && (
          <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.green, padding: "8px 0" }}>✓ You're handling this</span>
        )}
      </div>

      {/* Expanded detail section */}
      <div style={{
        maxHeight: expanded ? 500 : 0,
        opacity: expanded ? 1 : 0,
        overflow: "hidden",
        transition: "max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease",
      }}>
        <div style={{
          borderTop: `1px solid ${COLORS.border}`,
          paddingTop: 14,
          marginTop: 6,
          display: "flex", flexDirection: "column", gap: 14,
        }}>
          {property.whatHappened && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.red, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>What happened</div>
                <div style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.7 }}>{property.whatHappened}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.green, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Agent already did</div>
                <div style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.7 }}>{property.agentDid}</div>
              </div>
            </div>
          )}
          {l && (
            <div style={{ display: "flex", gap: 24, fontSize: 13, color: COLORS.text, flexWrap: "wrap", paddingTop: 4 }}>
              <span><span style={{ color: COLORS.textSecondary }}>Owner:</span> {l.owner}</span>
              <span><span style={{ color: COLORS.textSecondary }}>Type:</span> {l.type}</span>
              <span><span style={{ color: COLORS.textSecondary }}>Bedrooms:</span> {l.bedrooms}</span>
              <span><span style={{ color: COLORS.textSecondary }}>Rating:</span> ★ {l.rating} ({l.reviews})</span>
              <span><span style={{ color: COLORS.textSecondary }}>Next booking:</span> {l.nextBooking}</span>
            </div>
          )}

          {/* Action buttons — at the bottom when expanded */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", borderTop: `1px solid ${COLORS.border}`, paddingTop: 14, marginTop: 4 }}>
            {property.actionLabel && !actionDone && (
              <button
                onClick={(e) => { e.stopPropagation(); setActionDone(true); onApproveAction?.(property.id); }}
                style={{
                  fontSize: 13, fontWeight: 600, padding: "10px 20px", borderRadius: 6,
                  border: "none", backgroundColor: COLORS.text, color: COLORS.white, cursor: "pointer",
                }}
              >
                {property.actionLabel}
              </button>
            )}
            {property.actionLabel2 && !actionDone && (
              <button
                onClick={(e) => { e.stopPropagation(); setActionDone(true); onApproveAction?.(property.id); }}
                style={{
                  fontSize: 13, fontWeight: 600, padding: "10px 20px", borderRadius: 6,
                  border: `1px solid ${COLORS.border}`, backgroundColor: COLORS.white, color: COLORS.text, cursor: "pointer",
                }}
              >
                {property.actionLabel2}
              </button>
            )}
            {actionDone && (property.actionLabel || property.actionLabel2) && (
              <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.green, padding: "10px 0" }}>✓ Done</span>
            )}
            {needsAction && !handleDone && (
              <button
                onClick={(e) => { e.stopPropagation(); onHandleIt(property.id); }}
                style={{
                  fontSize: 13, fontWeight: 500, padding: "10px 20px", borderRadius: 6,
                  border: `1px solid ${COLORS.border}`, backgroundColor: "transparent",
                  color: COLORS.text, cursor: "pointer",
                }}
              >
                I'll handle it
              </button>
            )}
            {handleDone && (
              <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.green, padding: "10px 0" }}>✓ You're handling this</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


// ─── Finances Data ───
const financeStats = {
  revenueThisMonth: "€31,240",
  revenueDelta: "+12%",
  commissionEarned: "€6,248",
  commissionRate: "20%",
  totalExpenses: "€8,730",
  expenseDelta: "+3%",
  netProfit: "€22,510",
  profitDelta: "+16%",
  pendingPayouts: 4,
  pendingAmount: "€5,420",
  overdueInvoices: 2,
  overdueAmount: "€360",
};

const monthlyTrend = [
  { month: "Jan", revenue: 22100, expenses: 7200, profit: 14900 },
  { month: "Feb", revenue: 24475, expenses: 7800, profit: 16675 },
  { month: "Mar", revenue: 27900, expenses: 8100, profit: 19800 },
  { month: "Apr", revenue: 26200, expenses: 8400, profit: 17800 },
  { month: "May", revenue: 29800, expenses: 8200, profit: 21600 },
  { month: "Jun", revenue: 31240, expenses: 8730, profit: 22510 },
  // Forecast
  { month: "Jul", revenue: 34500, expenses: 9100, profit: 25400, forecast: true },
  { month: "Aug", revenue: 37200, expenses: 9400, profit: 27800, forecast: true },
  { month: "Sep", revenue: 32800, expenses: 8900, profit: 23900, forecast: true },
];

const propertyFinances = [
  { name: "Villa Mimosa", owner: "M. Renard", revenue: "€4,870", expenses: "€1,240", payout: "€3,630", status: "paid", occupancy: 88 },
  { name: "Apt. Garibaldi", owner: "Mme. Costa", revenue: "€3,060", expenses: "€780", payout: "€2,280", status: "paid", occupancy: 82 },
  { name: "Studio Promenade", owner: "M. Laurent", revenue: "€2,440", expenses: "€620", payout: "€1,820", status: "pending", occupancy: 74 },
  { name: "Maison Cimiez", owner: "Mme. Blanc", revenue: "€7,560", expenses: "€2,100", payout: "€5,460", status: "paid", occupancy: 92 },
  { name: "Apt. Libération", owner: "M. Dupont", revenue: "€2,600", expenses: "€680", payout: "€1,920", status: "paid", occupancy: 78 },
  { name: "Villa Roses", owner: "Mme. Moreau", revenue: "€3,040", expenses: "€890", payout: "€2,150", status: "pending", occupancy: 70 },
  { name: "Villa Paradiso", owner: "M. Ferretti", revenue: "€3,600", expenses: "€920", payout: "€2,680", status: "paid", occupancy: 85 },
  { name: "Apt. Masséna", owner: "Mme. Vidal", revenue: "€2,050", expenses: "€540", payout: "€1,510", status: "overdue", occupancy: 65 },
  { name: "Apt. Gambetta", owner: "M. Bernard", revenue: "€1,740", expenses: "€460", payout: "€1,280", status: "paid", occupancy: 72 },
  { name: "Apt. Port", owner: "Mme. Garnier", revenue: "€2,240", expenses: "€580", payout: "€1,660", status: "overdue", occupancy: 68 },
];

const expenseBreakdown = [
  { category: "Cleaning", amount: "€3,240", pct: 37, color: COLORS.accent },
  { category: "Maintenance", amount: "€2,180", pct: 25, color: COLORS.purple },
  { category: "Supplies", amount: "€1,050", pct: 12, color: COLORS.blue },
  { category: "Platform fees", amount: "€1,310", pct: 15, color: COLORS.yellow },
  { category: "Other", amount: "€950", pct: 11, color: COLORS.textSecondary },
];

// ─── Mini Bar Chart (SVG) ───
const MiniBarChart = ({ data, dataKey, color, forecastColor, height = 120 }) => {
  const maxVal = Math.max(...data.map((d) => d[dataKey]));
  const barWidth = 28;
  const gap = 8;
  const totalWidth = data.length * (barWidth + gap) - gap;

  return (
    <svg width={totalWidth} height={height + 20} style={{ display: "block" }}>
      {data.map((d, i) => {
        const barH = (d[dataKey] / maxVal) * height;
        const x = i * (barWidth + gap);
        const isForecast = d.forecast;
        return (
          <g key={d.month}>
            <rect
              x={x} y={height - barH} width={barWidth} height={barH}
              rx={3}
              fill={isForecast ? (forecastColor || color + "55") : color}
              stroke={isForecast ? color : "none"}
              strokeWidth={isForecast ? 1.5 : 0}
              strokeDasharray={isForecast ? "4 2" : "none"}
            />
            <text x={x + barWidth / 2} y={height + 14} textAnchor="middle" fontSize={9} fill={COLORS.textSecondary}>
              {d.month}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// ─── Horizontal Bar ───
const HorizontalBar = ({ pct, color }) => (
  <div style={{ flex: 1, height: 6, backgroundColor: COLORS.bg, borderRadius: 3, overflow: "hidden" }}>
    <div style={{ width: `${pct}%`, height: "100%", backgroundColor: color, borderRadius: 3 }} />
  </div>
);

// ─── Finances Page ───
const FinancesPage = ({ reportOpen, reportPinned, onCloseReport, onPinReport, onAskAgent }) => {
  const [finTab, setFinTab] = useState("overview");
  const [simNights, setSimNights] = useState(25);
  const [simRate, setSimRate] = useState(120);

  const simRevenue = simNights * simRate;
  const simExpenses = Math.round(simRevenue * 0.28);
  const simProfit = simRevenue - simExpenses;

  return (
    <>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Finances</h1>
          <p style={{ fontSize: 13, color: COLORS.textSecondary, margin: "4px 0 0" }}>
            June 2025 · 35 properties · All amounts before tax
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Badge label="Export CSV" bg={COLORS.white} color={COLORS.text} border={COLORS.border} />
          <Badge label="Jun 2025 ▾" bg={COLORS.white} color={COLORS.text} border={COLORS.border} />
        </div>
      </div>

      {/* June Report Widget — opened from chat or pinned */}
      {(reportOpen || reportPinned) && (
        <div style={{ marginBottom: 16 }}>
          <JuneReportWidget
            isPinned={reportPinned}
            onPin={onPinReport}
            onClose={onCloseReport}
          />
        </div>
      )}

      {/* Top stat cards */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <StatCard emoji="💰" label="Revenue" value={financeStats.revenueThisMonth} sub={`${financeStats.revenueDelta} vs May`} subColor={COLORS.green} />
        <StatCard emoji="🏦" label="Commission" value={financeStats.commissionEarned} sub={`${financeStats.commissionRate} avg rate`} />
        <StatCard emoji="📤" label="Expenses" value={financeStats.totalExpenses} sub={`${financeStats.expenseDelta} vs May`} subColor={COLORS.yellow} />
        <StatCard emoji="📊" label="Net profit" value={financeStats.netProfit} sub={`${financeStats.profitDelta} vs May`} subColor={COLORS.green} />
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: 16, borderBottom: `1px solid ${COLORS.border}` }}>
        {[
          { key: "overview", label: "Overview" },
          { key: "properties", label: "By property" },
          { key: "simulation", label: "Simulation" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFinTab(tab.key)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "10px 16px", border: "none", backgroundColor: "transparent",
              cursor: "pointer", fontSize: 13, fontWeight: finTab === tab.key ? 600 : 400,
              color: finTab === tab.key ? COLORS.text : COLORS.textSecondary,
              borderBottom: finTab === tab.key ? `2px solid ${COLORS.text}` : "2px solid transparent",
              marginBottom: -1,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Overview Tab ── */}
      {finTab === "overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Revenue trend chart */}
          <div style={{
            backgroundColor: COLORS.white, borderRadius: 8, border: `1px solid ${COLORS.border}`,
            padding: 20, gridColumn: "span 2",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Revenue & Profit Trend</div>
              <AiButton onClick={() => onAskAgent?.({ context: "revenue", title: "Revenue & Profit Trend" })} />
            </div>
            <div style={{ fontSize: 12, color: COLORS.textSecondary, marginBottom: 16 }}>
              Monthly totals · Dashed bars = forecast
            </div>
            <div style={{ display: "flex", gap: 40, alignItems: "flex-end" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: COLORS.accent }} />
                  <span style={{ fontSize: 11, color: COLORS.textSecondary }}>Revenue</span>
                </div>
                <MiniBarChart data={monthlyTrend} dataKey="revenue" color={COLORS.accent} height={100} />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: COLORS.green }} />
                  <span style={{ fontSize: 11, color: COLORS.textSecondary }}>Net profit</span>
                </div>
                <MiniBarChart data={monthlyTrend} dataKey="profit" color={COLORS.green} height={100} />
              </div>
            </div>
          </div>

          {/* Expense breakdown */}
          <div style={{
            backgroundColor: COLORS.white, borderRadius: 8, border: `1px solid ${COLORS.border}`,
            padding: 20, display: "flex", flexDirection: "column",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Expense breakdown</div>
              <AiButton onClick={() => onAskAgent?.({ context: "expenses", title: "Expense Breakdown" })} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
              {expenseBreakdown.map((e) => (
                <div key={e.category} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 500, width: 90, color: COLORS.text, textAlign: "right" }}>{e.category}</span>
                  <span style={{ fontSize: 11, color: COLORS.textSecondary, width: 28 }}>{e.pct}%</span>
                  <HorizontalBar pct={e.pct} color={COLORS.accent} />
                </div>
              ))}
            </div>
            {/* AI insight callout */}
            <div style={{
              marginTop: 20, padding: "12px 14px", backgroundColor: COLORS.agentBg,
              borderRadius: 8, border: `1px solid ${COLORS.border}`,
              display: "flex", alignItems: "flex-start", gap: 10,
            }}>
              <span style={{ fontSize: 15, color: COLORS.textSecondary, opacity: 0.5, marginTop: 1 }}>✦</span>
              <div style={{ fontSize: 12, color: COLORS.text, lineHeight: 1.6 }}>
                Based on 6 months of data, cleaning costs <span style={{ fontWeight: 600 }}>12% above seasonal average</span> — potential saving identified
              </div>
            </div>
          </div>

          {/* AI suggestions */}
          <div style={{
            backgroundColor: COLORS.white, borderRadius: 8, border: `1px solid ${COLORS.border}`,
            padding: 20, display: "flex", flexDirection: "column",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>AI suggestions</div>
              <AiButton onClick={() => onAskAgent?.({ context: "suggestions", title: "AI Suggestions" })} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 20, flex: 1 }}>
              {[
                { confidence: "High", confidenceColor: COLORS.green, confidenceBg: COLORS.greenLight, title: "Switch cleaning provider for 3 properties", desc: <>Sophie R. charges €65/clean for 3 properties. ClPro quoted €45/clean — saves <span style={{ fontWeight: 700 }}>€360</span>/month</> },
                { confidence: "Medium", confidenceColor: COLORS.yellow, confidenceBg: COLORS.yellowLight, title: "Cancel unused insurance on Apt. Libération", desc: <>Duplicate appliance cover active — original policy already includes it. Saves <span style={{ fontWeight: 700 }}>€140</span>/month</> },
              ].map((item, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <button style={{ position: "absolute", top: 0, right: 0, padding: "2px 6px", fontSize: 13, fontWeight: 400, backgroundColor: "transparent", color: COLORS.textSecondary, border: "none", cursor: "pointer", lineHeight: 1 }}>✕</button>
                  <div style={{ display: "inline-block", padding: "3px 10px", fontSize: 11, fontWeight: 600, color: item.confidenceColor, backgroundColor: item.confidenceBg, borderRadius: 4, border: `1px solid ${item.confidenceColor}33`, marginBottom: 10 }}>
                    {item.confidence} confidence
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 4 }}>{item.title}</div>
                  <div style={{ fontSize: 12, color: COLORS.textSecondary, lineHeight: 1.6, marginBottom: 12 }}>{item.desc}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.accent, cursor: "pointer" }}>Approve</div>
                  {i === 0 && <div style={{ borderBottom: `1px solid ${COLORS.border}`, marginTop: 20 }} />}
                </div>
              ))}
            </div>
            {/* Finance agent attribution */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, paddingTop: 12, borderTop: `1px solid ${COLORS.border}` }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: COLORS.blue }} />
              <span style={{ fontSize: 12, color: COLORS.textSecondary }}>Finance agent</span>
            </div>
          </div>
        </div>
      )}

      {/* ── By Property Tab ── */}
      {finTab === "properties" && (
        <div style={{
          backgroundColor: COLORS.white, borderRadius: 8, border: `1px solid ${COLORS.border}`,
          overflow: "hidden",
        }}>
          {/* Table header */}
          <div style={{
            display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr 1fr 80px",
            padding: "10px 16px", fontSize: 11, fontWeight: 600, color: COLORS.textSecondary,
            borderBottom: `1px solid ${COLORS.border}`, backgroundColor: COLORS.bg,
            textTransform: "uppercase", letterSpacing: 0.5,
          }}>
            <span>Property</span>
            <span>Owner</span>
            <span style={{ textAlign: "right" }}>Revenue</span>
            <span style={{ textAlign: "right" }}>Expenses</span>
            <span style={{ textAlign: "right" }}>Payout</span>
            <span style={{ textAlign: "center" }}>Occupancy</span>
            <span style={{ textAlign: "center" }}>Status</span>
          </div>
          {/* Table rows */}
          {propertyFinances.map((p) => (
            <div key={p.name} style={{
              display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr 1fr 80px",
              padding: "10px 16px", fontSize: 12, color: COLORS.text,
              borderBottom: `1px solid ${COLORS.border}`, alignItems: "center",
            }}>
              <span style={{ fontWeight: 600 }}>{p.name}</span>
              <span style={{ color: COLORS.textSecondary }}>{p.owner}</span>
              <span style={{ textAlign: "right", fontWeight: 600 }}>{p.revenue}</span>
              <span style={{ textAlign: "right", color: COLORS.textSecondary }}>{p.expenses}</span>
              <span style={{ textAlign: "right", fontWeight: 600 }}>{p.payout}</span>
              <span style={{ textAlign: "center" }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 4,
                }}>
                  <div style={{ width: 32, height: 4, borderRadius: 2, backgroundColor: COLORS.bg, overflow: "hidden", display: "inline-block" }}>
                    <div style={{ width: `${p.occupancy}%`, height: "100%", backgroundColor: p.occupancy >= 80 ? COLORS.green : p.occupancy >= 70 ? COLORS.yellow : COLORS.red, borderRadius: 2 }} />
                  </div>
                  <span style={{ fontSize: 11, color: COLORS.textSecondary }}>{p.occupancy}%</span>
                </span>
              </span>
              <span style={{ textAlign: "center" }}>
                <Badge
                  label={p.status === "paid" ? "Paid" : p.status === "pending" ? "Pending" : "Overdue"}
                  bg={p.status === "paid" ? COLORS.greenLight : p.status === "pending" ? COLORS.yellowLight : COLORS.redLight}
                  color={p.status === "paid" ? COLORS.green : p.status === "pending" ? COLORS.yellow : COLORS.red}
                />
              </span>
            </div>
          ))}
          {/* Totals row */}
          <div style={{
            display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr 1fr 80px",
            padding: "12px 16px", fontSize: 12, fontWeight: 700, color: COLORS.text,
            backgroundColor: COLORS.bg,
          }}>
            <span>Total (10 properties)</span>
            <span></span>
            <span style={{ textAlign: "right" }}>€33,200</span>
            <span style={{ textAlign: "right" }}>€8,810</span>
            <span style={{ textAlign: "right" }}>€24,390</span>
            <span style={{ textAlign: "center", fontSize: 11, color: COLORS.textSecondary }}>78% avg</span>
            <span></span>
          </div>
        </div>
      )}

      {/* ── Simulation Tab ── */}
      {finTab === "simulation" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Controls */}
          <div style={{
            backgroundColor: COLORS.white, borderRadius: 8, border: `1px solid ${COLORS.border}`,
            padding: 20,
          }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Revenue Simulator</div>
            <div style={{ fontSize: 12, color: COLORS.textSecondary, marginBottom: 20 }}>
              Adjust parameters to forecast monthly revenue per property
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
                  <span style={{ color: COLORS.textSecondary }}>Nights booked / month</span>
                  <span style={{ fontWeight: 600 }}>{simNights}</span>
                </div>
                <input
                  type="range" min={10} max={30} value={simNights}
                  onChange={(e) => setSimNights(Number(e.target.value))}
                  style={{ width: "100%", accentColor: COLORS.accent }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: COLORS.textSecondary }}>
                  <span>10</span><span>30</span>
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
                  <span style={{ color: COLORS.textSecondary }}>Average nightly rate</span>
                  <span style={{ fontWeight: 600 }}>€{simRate}</span>
                </div>
                <input
                  type="range" min={60} max={250} step={5} value={simRate}
                  onChange={(e) => setSimRate(Number(e.target.value))}
                  style={{ width: "100%", accentColor: COLORS.accent }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: COLORS.textSecondary }}>
                  <span>€60</span><span>€250</span>
                </div>
              </div>

              <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 16 }}>
                <div style={{ fontSize: 11, color: COLORS.textSecondary, marginBottom: 4 }}>Assumptions</div>
                <div style={{ fontSize: 12, color: COLORS.text, lineHeight: 1.8 }}>
                  • Expense ratio: 28% of revenue<br/>
                  • Commission: 20% of revenue<br/>
                  • Based on single-property average
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div style={{
            backgroundColor: COLORS.white, borderRadius: 8, border: `1px solid ${COLORS.border}`,
            padding: 20, display: "flex", flexDirection: "column", gap: 16,
          }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Projected Monthly (per property)</div>

            <div style={{
              backgroundColor: COLORS.accentLight, borderRadius: 8, padding: 16,
              display: "flex", flexDirection: "column", gap: 4,
            }}>
              <div style={{ fontSize: 12, color: COLORS.textSecondary }}>Gross revenue</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.accent }}>€{simRevenue.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: COLORS.textSecondary }}>{simNights} nights × €{simRate}/night</div>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <div style={{
                flex: 1, backgroundColor: COLORS.bg, borderRadius: 8, padding: 14,
                display: "flex", flexDirection: "column", gap: 2,
              }}>
                <div style={{ fontSize: 11, color: COLORS.textSecondary }}>Expenses</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.red }}>−€{simExpenses.toLocaleString()}</div>
              </div>
              <div style={{
                flex: 1, backgroundColor: COLORS.greenLight, borderRadius: 8, padding: 14,
                display: "flex", flexDirection: "column", gap: 2,
              }}>
                <div style={{ fontSize: 11, color: COLORS.textSecondary }}>Net profit</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.green }}>€{simProfit.toLocaleString()}</div>
              </div>
            </div>

            <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 14 }}>
              <div style={{ fontSize: 12, color: COLORS.textSecondary, marginBottom: 8 }}>Scaled to portfolio (35 properties)</div>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: COLORS.textSecondary }}>Total revenue</div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>€{(simRevenue * 35).toLocaleString()}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: COLORS.textSecondary }}>Total profit</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.green }}>€{(simProfit * 35).toLocaleString()}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: COLORS.textSecondary }}>Your commission</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.accent }}>€{Math.round(simRevenue * 35 * 0.2).toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ─── June Report Widget (overlay / pinnable) ───
const JuneReportWidget = ({ onClose, onPin, isPinned }) => {
  const topMetrics = [
    { label: "Revenue", value: "€31,240", delta: "+12%", deltaColor: COLORS.green },
    { label: "Commission", value: "€6,248", delta: "20% rate", deltaColor: COLORS.textSecondary },
    { label: "Expenses", value: "€8,730", delta: "+3%", deltaColor: COLORS.yellow },
    { label: "Net Profit", value: "€22,510", delta: "+16%", deltaColor: COLORS.green },
  ];

  const alerts = [
    { text: "2 pending payouts — €3,970 waiting on invoices", color: COLORS.yellow, bg: COLORS.yellowLight },
    { text: "2 overdue invoices — €360 (reminders sent)", color: COLORS.red, bg: COLORS.redLight },
  ];

  const topProperties = [
    { name: "Maison Cimiez", revenue: "€7,560", occ: 92 },
    { name: "Villa Mimosa", revenue: "€4,870", occ: 88 },
    { name: "Villa Paradiso", revenue: "€3,600", occ: 85 },
  ];

  return (
    <div style={{
      backgroundColor: COLORS.white,
      borderRadius: 10,
      border: `1.5px solid ${COLORS.accent}`,
      boxShadow: isPinned ? "none" : "0 8px 32px rgba(0,0,0,0.12)",
      overflow: "hidden",
      ...(isPinned ? {} : {
        position: "relative",
        animation: "fadeIn 0.2s ease-out",
      }),
    }}>
      {/* Header bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 16px",
        backgroundColor: COLORS.accentLight,
        borderBottom: `1px solid ${COLORS.accent}22`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 15 }}>📊</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>June 2025 Report</span>
          <Badge label="Finance Agent" bg={COLORS.greenLight} color={COLORS.green} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {!isPinned && (
            <button
              onClick={onPin}
              title="Pin to dashboard"
              style={{
                display: "flex", alignItems: "center", gap: 4,
                fontSize: 11, fontWeight: 600, padding: "5px 10px", borderRadius: 5,
                border: `1px solid ${COLORS.border}`, backgroundColor: COLORS.white,
                color: COLORS.text, cursor: "pointer",
              }}
            >
              <span style={{ fontSize: 13 }}>📌</span> Pin to dashboard
            </button>
          )}
          {isPinned && (
            <span style={{ fontSize: 11, fontWeight: 500, color: COLORS.green, display: "flex", alignItems: "center", gap: 4, marginRight: 8 }}>
              <span style={{ fontSize: 12 }}>📌</span> Pinned
            </span>
          )}
          <button
            onClick={onClose}
            title={isPinned ? "Unpin from dashboard" : "Close report"}
            style={{
              width: 26, height: 26, borderRadius: 5,
              border: `1px solid ${COLORS.border}`, backgroundColor: COLORS.white,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, color: COLORS.textSecondary,
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Metrics row */}
      <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${COLORS.border}` }}>
        {topMetrics.map((m, i) => (
          <div key={m.label} style={{
            flex: 1, padding: "12px 14px",
            borderRight: i < topMetrics.length - 1 ? `1px solid ${COLORS.border}` : "none",
          }}>
            <div style={{ fontSize: 11, color: COLORS.textSecondary, marginBottom: 2 }}>{m.label}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.text }}>{m.value}</div>
            <div style={{ fontSize: 11, color: m.deltaColor, fontWeight: 500 }}>{m.delta} vs May</div>
          </div>
        ))}
      </div>

      {/* Body: alerts + top properties side by side */}
      <div style={{ display: "flex", gap: 0 }}>
        {/* Alerts */}
        <div style={{ flex: 1, padding: "12px 14px", borderRight: `1px solid ${COLORS.border}` }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.textSecondary, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Alerts</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {alerts.map((a) => (
              <div key={a.text} style={{
                fontSize: 12, padding: "6px 10px", borderRadius: 5,
                backgroundColor: a.bg, color: a.color, fontWeight: 500, lineHeight: 1.4,
              }}>
                {a.text}
              </div>
            ))}
          </div>
        </div>

        {/* Top properties */}
        <div style={{ flex: 1, padding: "12px 14px" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.textSecondary, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Top Properties</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {topProperties.map((p, i) => (
              <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
                <span style={{ width: 16, height: 16, borderRadius: 4, backgroundColor: COLORS.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: COLORS.textSecondary, flexShrink: 0 }}>{i + 1}</span>
                <span style={{ fontWeight: 600, flex: 1, color: COLORS.text }}>{p.name}</span>
                <span style={{ fontWeight: 600, color: COLORS.text }}>{p.revenue}</span>
                <span style={{ fontSize: 11, color: COLORS.textSecondary }}>{p.occ}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: "8px 14px",
        borderTop: `1px solid ${COLORS.border}`,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        backgroundColor: COLORS.bg,
      }}>
        <span style={{ fontSize: 11, color: COLORS.textSecondary }}>Summary from Finance Agent · See details below</span>
      </div>
    </div>
  );
};

// ─── Agent Detail Page ───
const AgentDetailPage = ({ agent, onBack, panelOpen, onOpenPanel }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [taskThresholds, setTaskThresholds] = useState({});
  const [taskThresholdsOriginal, setTaskThresholdsOriginal] = useState({});

  const handleSelectTask = (task) => {
    if (selectedTask?.name === task.name) {
      setSelectedTask(null);
    } else {
      setSelectedTask(task);
      setTaskThresholds({ ...task.thresholds });
      setTaskThresholdsOriginal({ ...task.thresholds });
    }
  };

  const handleSettingSave = () => {
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  return (
    <>
      {/* Back + Header */}
      <div style={{ marginBottom: 20 }}>
        <button
          onClick={onBack}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 12, fontWeight: 500, color: COLORS.textSecondary,
            background: "none", border: "none", cursor: "pointer",
            padding: 0, marginBottom: 12,
          }}
        >
          ← Back to Agents
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            backgroundColor: agent.colorLight, border: `1.5px solid ${agent.color}22`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24,
          }}>
            {agent.icon}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>{agent.name}</h1>
              <Badge
                label={agent.status === "active" ? "Active" : "Paused"}
                bg={agent.status === "active" ? COLORS.greenLight : COLORS.yellowLight}
                color={agent.status === "active" ? COLORS.green : COLORS.yellow}
              />
              <Badge label={agent.category} bg={COLORS.bg} color={COLORS.textSecondary} />
            </div>
            <p style={{ fontSize: 13, color: COLORS.textSecondary, margin: "4px 0 0", maxWidth: 600 }}>
              {agent.description}
            </p>
          </div>
          {!panelOpen && (
            <button
              onClick={onOpenPanel}
              style={{
                width: 32, height: 32, borderRadius: 8,
                border: `1px solid ${COLORS.border}`,
                backgroundColor: COLORS.white,
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, color: agent.color, flexShrink: 0,
              }}
              title={`Chat with ${agent.name}`}
            >
              ✦
            </button>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <StatCard emoji="⚡" label="Actions today" value={agent.actionsToday} />
        <StatCard emoji="📈" label="Total actions" value={agent.actionsTotal.toLocaleString()} />
        <StatCard emoji="🎯" label="Accuracy" value={`${agent.accuracy}%`} sub={agent.accuracy >= 95 ? "Excellent" : "Good"} subColor={agent.accuracy >= 95 ? COLORS.green : COLORS.yellow} />
        <StatCard emoji="🏠" label="Properties" value={agent.propertiesManaged} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Performance */}
        <div style={{
          backgroundColor: COLORS.white, borderRadius: 8, border: `1px solid ${COLORS.border}`,
          padding: 20,
        }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Performance</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { label: "Accuracy rate", value: agent.accuracy, color: agent.accuracy >= 95 ? COLORS.green : COLORS.yellow },
              { label: "Auto-resolved", value: Math.round(agent.accuracy * 0.85), color: COLORS.blue },
              { label: "Escalation rate", value: 100 - agent.accuracy, color: COLORS.accent },
            ].map((m) => (
              <div key={m.label}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: COLORS.textSecondary }}>{m.label}</span>
                  <span style={{ fontWeight: 600 }}>{m.value}%</span>
                </div>
                <HorizontalBar pct={m.value} color={m.color} />
              </div>
            ))}
          </div>
        </div>

        {/* Integrations */}
        <div style={{
          backgroundColor: COLORS.white, borderRadius: 8, border: `1px solid ${COLORS.border}`,
          padding: 20,
        }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Integrations</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {(agent.integrations || []).map((intg, i) => (
              <div key={intg.name} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: i < agent.integrations.length - 1 ? `1px solid ${COLORS.border}` : "none",
              }}>
                <span style={{ fontSize: 12, color: COLORS.text }}>{intg.name}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{
                    width: 6, height: 6, borderRadius: "50%",
                    backgroundColor: intg.status === "connected" ? COLORS.green : COLORS.red,
                  }} />
                  <span style={{ fontSize: 11, color: intg.status === "connected" ? COLORS.green : COLORS.red, fontWeight: 500 }}>
                    {intg.status === "connected" ? "Connected" : "Disconnected"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tasks */}
        <div style={{
          backgroundColor: COLORS.white, borderRadius: 8, border: `1px solid ${COLORS.border}`,
          padding: 0, gridColumn: "span 2",
          display: "flex", overflow: "hidden",
        }}>
          {/* Task list (left side — aligns with Performance card above) */}
          <div style={{
            flex: selectedTask ? "0 0 45%" : "1 1 100%",
            maxWidth: selectedTask ? "45%" : "none",
            borderRight: selectedTask ? `1px solid ${COLORS.border}` : "none",
            padding: 20,
            transition: "flex 0.15s",
          }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Tasks</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {(agent.tasks || []).map((t, i) => {
                const modeColor = t.mode === "auto" ? COLORS.green : t.mode === "approval" ? COLORS.yellow : COLORS.red;
                const modeLabel = t.mode === "auto" ? "Automatic" : t.mode === "approval" ? "Needs approval" : "Disabled";
                const isSelected = selectedTask?.name === t.name;
                return (
                  <div
                    key={t.name}
                    onClick={() => handleSelectTask(t)}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "10px 8px",
                      marginLeft: -8, marginRight: -8,
                      borderRadius: 6,
                      borderBottom: i < agent.tasks.length - 1 ? `1px solid ${COLORS.border}` : "none",
                      cursor: "pointer",
                      backgroundColor: isSelected ? COLORS.bg : "transparent",
                    }}
                  >
                    <span style={{ fontSize: 12, color: COLORS.text, fontWeight: isSelected ? 600 : 400 }}>{t.name}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Badge label={modeLabel} bg={modeColor + "18"} color={modeColor} />
                      <span style={{ fontSize: 10, color: COLORS.textSecondary }}>›</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Task detail (right side) */}
          {selectedTask && (
            <div style={{
              flex: "1 1 60%",
              padding: 20,
              overflowY: "auto",
              display: "flex", flexDirection: "column", gap: 16,
            }}>
              {/* Header */}
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>{selectedTask.name}</div>
                  <Badge
                    label={selectedTask.mode === "auto" ? "Automatic" : selectedTask.mode === "approval" ? "Needs approval" : "Disabled"}
                    bg={(selectedTask.mode === "auto" ? COLORS.green : selectedTask.mode === "approval" ? COLORS.yellow : COLORS.red) + "18"}
                    color={selectedTask.mode === "auto" ? COLORS.green : selectedTask.mode === "approval" ? COLORS.yellow : COLORS.red}
                  />
                </div>
                <div style={{ fontSize: 12, color: COLORS.textSecondary, lineHeight: 1.6 }}>
                  {selectedTask.description}
                </div>
              </div>

              {/* Escalation rules */}
              {selectedTask.escalations && selectedTask.escalations.length > 0 && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.textSecondary, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Escalation Rules</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                    {selectedTask.escalations.map((rule, i) => {
                      const parts = rule.split(" → ");
                      return (
                        <div key={i} style={{
                          padding: "8px 0",
                          borderBottom: i < selectedTask.escalations.length - 1 ? `1px solid ${COLORS.border}` : "none",
                        }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.text, marginBottom: 2 }}>
                            {parts[0]}
                          </div>
                          {parts[1] && (
                            <div style={{ fontSize: 11, color: COLORS.textSecondary, display: "flex", alignItems: "center", gap: 4 }}>
                              <span style={{ color: COLORS.accent }}>→</span> {parts[1]}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Thresholds */}
              {Object.keys(taskThresholds).length > 0 && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.textSecondary, textTransform: "uppercase", letterSpacing: 0.5 }}>Thresholds</div>
                    {(settingsSaved || JSON.stringify(taskThresholds) !== JSON.stringify(taskThresholdsOriginal)) && (
                      <button
                        onClick={handleSettingSave}
                        style={{
                          fontSize: 10, fontWeight: 600, padding: "4px 10px", borderRadius: 5,
                          border: "none",
                          backgroundColor: settingsSaved ? COLORS.green : COLORS.text,
                          color: COLORS.white, cursor: "pointer",
                          transition: "background-color 0.2s",
                        }}
                      >
                        {settingsSaved ? "✓ Saved" : "Save"}
                      </button>
                    )}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                    {Object.entries(taskThresholds).map(([key, value], i) => {
                      const label = key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (s) => s.toUpperCase());
                      const isBool = typeof value === "boolean";
                      return (
                        <div key={key} style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          padding: "8px 0",
                          borderBottom: i < Object.keys(taskThresholds).length - 1 ? `1px solid ${COLORS.border}` : "none",
                        }}>
                          <span style={{ fontSize: 12, color: COLORS.text }}>{label}</span>
                          {isBool ? (
                            <button
                              onClick={() => setTaskThresholds((s) => ({ ...s, [key]: !value }))}
                              style={{
                                width: 40, height: 22, borderRadius: 11,
                                border: "none", cursor: "pointer",
                                backgroundColor: value ? COLORS.green : COLORS.border,
                                position: "relative",
                                transition: "background-color 0.2s",
                              }}
                            >
                              <div style={{
                                width: 16, height: 16, borderRadius: "50%",
                                backgroundColor: COLORS.white,
                                position: "absolute", top: 3,
                                left: value ? 21 : 3,
                                transition: "left 0.2s",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                              }} />
                            </button>
                          ) : (
                            <input
                              value={value}
                              onChange={(e) => setTaskThresholds((s) => ({ ...s, [key]: e.target.value }))}
                              style={{
                                fontSize: 12, padding: "5px 8px", borderRadius: 6,
                                border: `1px solid ${COLORS.border}`, outline: "none",
                                width: 140, textAlign: "right", color: COLORS.text,
                              }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Empty state for no escalations/thresholds */}
              {(!selectedTask.escalations || selectedTask.escalations.length === 0) && Object.keys(taskThresholds).length === 0 && (
                <div style={{ fontSize: 12, color: COLORS.textSecondary, fontStyle: "italic", padding: "8px 0" }}>
                  No escalation rules or thresholds configured for this task.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// ─── Agents Page (listing) ───
const AgentsPage = ({ onSelectAgent, panelOpen, onOpenPanel }) => {
  const [filter, setFilter] = useState("all");
  const activeCount = agentsData.filter((a) => a.status === "active").length;
  const pausedCount = agentsData.filter((a) => a.status === "paused").length;

  const filtered = filter === "all" ? agentsData
    : filter === "active" ? agentsData.filter((a) => a.status === "active")
    : agentsData.filter((a) => a.status === "paused");

  return (
    <>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Agents</h1>
          <p style={{ fontSize: 13, color: COLORS.textSecondary, margin: "4px 0 0" }}>
            {agentsData.length} agents configured · {activeCount} active · {pausedCount} paused
          </p>
        </div>
        {!panelOpen && (
          <button
            onClick={onOpenPanel}
            style={{
              width: 32, height: 32, borderRadius: 8,
              border: `1px solid ${COLORS.border}`,
              backgroundColor: COLORS.white,
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, color: COLORS.accent,
            }}
            title="Open agent chat"
          >
            ✦
          </button>
        )}
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <StatCard emoji="🤖" label="Total agents" value={agentsData.length} />
        <StatCard emoji="✅" label="Active" value={activeCount} sub="Running" subColor={COLORS.green} />
        <StatCard emoji="⏸" label="Paused" value={pausedCount} sub="Inactive" subColor={COLORS.yellow} />
        <StatCard emoji="⚡" label="Actions today" value={agentsData.reduce((s, a) => s + a.actionsToday, 0)} sub="Across all agents" />
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: 16, borderBottom: `1px solid ${COLORS.border}` }}>
        {[
          { key: "all", label: "All agents", count: agentsData.length },
          { key: "active", label: "Active", count: activeCount },
          { key: "paused", label: "Paused", count: pausedCount },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "10px 16px", border: "none", backgroundColor: "transparent",
              cursor: "pointer", fontSize: 13, fontWeight: filter === tab.key ? 600 : 400,
              color: filter === tab.key ? COLORS.text : COLORS.textSecondary,
              borderBottom: filter === tab.key ? `2px solid ${COLORS.text}` : "2px solid transparent",
              marginBottom: -1,
            }}
          >
            {tab.label}
            <span style={{
              fontSize: 11, fontWeight: 600, padding: "1px 7px", borderRadius: 10,
              backgroundColor: filter === tab.key ? COLORS.text : COLORS.bg,
              color: filter === tab.key ? COLORS.white : COLORS.textSecondary,
            }}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Agent cards grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
        {filtered.map((agent) => (
          <div
            key={agent.id}
            onClick={() => onSelectAgent(agent)}
            style={{
              backgroundColor: COLORS.white, borderRadius: 8,
              border: `1.5px solid ${COLORS.border}`,
              padding: "16px 18px",
              cursor: "pointer",
              display: "flex", flexDirection: "column", gap: 10,
              transition: "border-color 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = agent.color;
              e.currentTarget.style.boxShadow = `0 2px 12px ${agent.color}15`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = COLORS.border;
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {/* Row 1: Icon, name, status */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                backgroundColor: agent.colorLight, border: `1px solid ${agent.color}22`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18,
              }}>
                {agent.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>{agent.name}</div>
                <div style={{ fontSize: 11, color: COLORS.textSecondary }}>{agent.category}</div>
              </div>
              <Badge
                label={agent.status === "active" ? "Active" : "Paused"}
                bg={agent.status === "active" ? COLORS.greenLight : COLORS.yellowLight}
                color={agent.status === "active" ? COLORS.green : COLORS.yellow}
              />
            </div>

            {/* Description */}
            <div style={{ fontSize: 12, color: COLORS.textSecondary, lineHeight: 1.5 }}>
              {agent.description.length > 120 ? agent.description.slice(0, 120) + "…" : agent.description}
            </div>

            {/* Stats row */}
            <div style={{
              display: "flex", gap: 16, fontSize: 11, color: COLORS.textSecondary,
              borderTop: `1px solid ${COLORS.border}`, paddingTop: 10, marginTop: "auto",
            }}>
              <span><span style={{ fontWeight: 600, color: COLORS.text }}>{agent.actionsToday}</span> today</span>
              <span><span style={{ fontWeight: 600, color: COLORS.text }}>{agent.actionsTotal.toLocaleString()}</span> total</span>
              <span><span style={{ fontWeight: 600, color: COLORS.text }}>{agent.accuracy}%</span> accuracy</span>
              <span style={{ marginLeft: "auto", fontSize: 10 }}>{agent.lastActive}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

const StatCard = ({ emoji, label, value, sub, subColor }) => (
  <div
    style={{
      backgroundColor: COLORS.white,
      borderRadius: 10,
      border: `1px solid ${COLORS.border}`,
      padding: "14px 18px",
      flex: 1,
      minWidth: 130,
    }}
  >
    <div style={{ fontSize: 12, color: COLORS.textSecondary, marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ fontSize: 14 }}>{emoji}</span> {label}
    </div>
    <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
      <span style={{ fontSize: 24, fontWeight: 700, color: COLORS.text }}>{value}</span>
      {sub && <span style={{ fontSize: 11, color: subColor || COLORS.textSecondary, fontWeight: 500 }}>{sub}</span>}
    </div>
  </div>
);

const ChatMessage = ({ message, onApprove }) => {
  const isEscalation = message.type === "escalation" || message.type === "alert";
  return (
    <div
      style={{
        padding: "12px 14px",
        borderBottom: `1px solid ${COLORS.border}`,
        backgroundColor: isEscalation && !message.resolved ? COLORS.agentBg : "transparent",
      }}
    >
      {/* Property label */}
      {message.property && (
        <div style={{ marginBottom: 6 }}>
          <span style={{
            fontSize: 10,
            fontWeight: 600,
            padding: "2px 6px",
            borderRadius: 3,
            backgroundColor: COLORS.bg,
            color: COLORS.textSecondary,
            border: `1px solid ${COLORS.border}`,
          }}>
            {message.property}
          </span>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              backgroundColor: message.agentColor,
            }}
          />
          <span style={{ fontSize: 11, fontWeight: 600, color: message.agentColor }}>
            {message.agent} Agent
          </span>
          {isEscalation && !message.resolved && (
            <span style={{ fontSize: 10, fontWeight: 600, color: COLORS.red, marginLeft: 4 }}>
              NEEDS INPUT
            </span>
          )}
        </div>
        <span style={{ fontSize: 10, color: COLORS.textSecondary }}>{message.time}</span>
      </div>

      <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.text, marginBottom: 4 }}>
        {message.title}
      </div>

      <div style={{ fontSize: 12, color: COLORS.textSecondary, lineHeight: 1.5 }}>
        {message.body}
      </div>

      {message.action && !message.resolved && (
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <button
            onClick={() => onApprove?.(message.id)}
            style={{
              fontSize: 12,
              fontWeight: 600,
              padding: "6px 14px",
              borderRadius: 6,
              border: "none",
              backgroundColor: COLORS.text,
              color: COLORS.white,
              cursor: "pointer",
            }}
          >
            {message.action}
          </button>
          <button
            style={{
              fontSize: 12,
              fontWeight: 500,
              padding: "6px 14px",
              borderRadius: 6,
              border: `1px solid ${COLORS.border}`,
              backgroundColor: "transparent",
              color: COLORS.text,
              cursor: "pointer",
            }}
          >
            View details
          </button>
        </div>
      )}

      {message.resolved && (
        <div style={{ fontSize: 11, color: COLORS.green, fontWeight: 500, marginTop: 6 }}>
          ✓ Handled automatically
        </div>
      )}
    </div>
  );
};

// ─── Main Dashboard ───
export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState("Today");
  const [properties, setProperties] = useState(initialProperties);
  const [messages, setMessages] = useState(agentMessages);
  const [financeMessages, setFinanceMessages] = useState(financeActivityMessages);
  const [expandedActivityId, setExpandedActivityId] = useState(null);
  const [chatInput, setChatInput] = useState("");
  const [panelTab, setPanelTab] = useState("chat");
  const [panelOpen, setPanelOpen] = useState(true);
  const [cardTab, setCardTab] = useState("attention");
  const [expandedCardId, setExpandedCardId] = useState(null);
  const [handlingIds, setHandlingIds] = useState(new Set());
  const [fadingOutIds, setFadingOutIds] = useState(new Set());
  const [toastMsg, setToastMsg] = useState(null);

  const handleItClick = (propertyId) => {
    const prop = properties.find((p) => p.id === propertyId);
    // Start fade-out, then move to handling after animation
    setFadingOutIds((prev) => new Set([...prev, propertyId]));
    setExpandedCardId(null);
    setToastMsg(`You're now handling ${prop?.name ?? "this issue"}`);
    setTimeout(() => setToastMsg(null), 3000);
    setTimeout(() => {
      setFadingOutIds((prev) => { const next = new Set(prev); next.delete(propertyId); return next; });
      setHandlingIds((prev) => new Set([...prev, propertyId]));
    }, 350);
  };
  const markDone = (propertyId) => {
    setHandlingIds((prev) => { const next = new Set(prev); next.delete(propertyId); return next; });
    const prop = properties.find((p) => p.id === propertyId);
    setToastMsg(`${prop?.name ?? "Issue"} marked as done`);
    setTimeout(() => setToastMsg(null), 3000);
  };
  const handBack = (propertyId) => {
    setHandlingIds((prev) => { const next = new Set(prev); next.delete(propertyId); return next; });
    const prop = properties.find((p) => p.id === propertyId);
    setToastMsg(`${prop?.name ?? "Issue"} handed back to agent`);
    setTimeout(() => setToastMsg(null), 3000);
  };
  const financeWelcomeMessages = [
    {
      role: "agent",
      agent: "Finance Agent",
      agentColor: COLORS.green,
      text: "Good morning, Marie. I've prepared your June monthly report — revenue is up 12% vs May at €31,240, and net profit grew 16% to €22,510.\n\n2 owner payouts are pending (€3,970 total) and 2 invoices are overdue (€360). I've already sent reminders on the overdue ones.",
      showReportButton: true,
      followUps: [
        "Break down the revenue by property",
        "What's driving the expense increase?",
        "When will pending payouts clear?",
        "Forecast for next quarter",
      ],
    },
  ];
  const todayWelcomeMessages = [
    {
      role: "agent",
      agent: "Supervisor",
      agentColor: COLORS.textSecondary,
      text: "Good morning Marie. You have 4 items needing attention today. Villa Mimosa is the most urgent — a cleaner cancelled and I've found a backup, but I need your approval before confirming. Studio Promenade has a delayed payment I'm still chasing.",
      followUps: [
        "Show me the backup cleaner's profile",
        "Show turnover schedule for Villa Mimosa",
      ],
    },
  ];
  const [chatMessages, setChatMessages] = useState(todayWelcomeMessages);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportPinned, setReportPinned] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);

  const handlePropertyApprove = (propertyId) => {
    const prop = properties.find((p) => p.id === propertyId);
    const actionName = prop?.actionLabel?.replace("Approve ", "") ?? "action";
    setToastMsg(`✓ Approved ${actionName} — ${prop?.name ?? "Property"} moved to On track`);
    setTimeout(() => setToastMsg(null), 4000);
    // Fade out, then move to On track
    setFadingOutIds((prev) => new Set([...prev, propertyId]));
    setExpandedCardId(null);
    setTimeout(() => {
      setFadingOutIds((prev) => { const next = new Set(prev); next.delete(propertyId); return next; });
      setProperties((prev) =>
        prev.map((p) =>
          p.id === propertyId
            ? { ...p, urgency: "none", statusLabel: "On track", status: "on-track", actionLabel: null, approvedAction: actionName, detail: `${actionName.charAt(0).toUpperCase() + actionName.slice(1)} approved · Agent is handling it` }
            : p
        )
      );
    }, 350);
  };

  const handleApprove = (id) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, resolved: true } : m))
    );
    setFinanceMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, resolved: true } : m))
    );
  };

  // Open chat with context about a specific property
  const handleAskAgent = (property) => {
    const contextMessages = {
      "Villa Mimosa": {
        agent: "Operations Agent",
        agentColor: COLORS.accent,
        text: `Villa Mimosa — Turnover at risk.\n\nCleaner Nadia cancelled at 09:12 (sick). Backup option: Léa (4.8★, 25min away, can start 10:30, estimated finish 14:30). Check-in at 16:00 gives 1.5hr buffer.\n\nCurrent guest checks out at 10:00 — on schedule. Incoming guest (4 people, 3-night stay) hasn't received check-in instructions yet — I'm holding those until turnover is confirmed.`,
        actions: [
          { label: "Book Léa as replacement", primary: true, response: "Done — Léa is booked for 10:30. She's confirmed and has the door code and cleaning checklist. I'll send check-in instructions to the incoming guest once she starts. ETA finish: 14:30, giving a 1.5hr buffer before the 16:00 check-in." },
          { label: "Find other cleaners", response: "Searching for other available cleaners in the area...\n\nFound 2 more options:\n• Marc D. — available at 11:00, 35min away, 4.6★\n• Julie P. — available at 12:00, 20min away, 4.9★ (but later start cuts the buffer tight)\n\nLéa is still the best option time-wise. Want me to book one of these instead?" },
          { label: "Send check-in instructions now", response: "Check-in instructions sent to the incoming guest now — includes lockbox code, parking info, and WiFi details.\n\nNote: I've added a line saying exact entry time will be confirmed by 14:00, in case the turnover runs late. I'll update them once cleaning is confirmed complete." },
          { label: "I'll handle it myself", response: "Understood — I've flagged this as manually handled. I won't take any action on Villa Mimosa's turnover. Let me know if you need anything else." },
        ],
      },
      "Apt. Garibaldi": {
        agent: "Maintenance Agent",
        agentColor: COLORS.purple,
        text: `Apt. Garibaldi — AC failure reported.\n\nGuest messaged at 08:47: "The air conditioning stopped working overnight, it was very hot." This is a mid-stay guest (day 3 of 5, 2 occupants).\n\nI've contacted 2 contractors:\n• Dupont HVAC — available today at 14:00, estimate €120\n• Côte Clim — earliest tomorrow morning, estimate €95\n\nThe guest hasn't complained further but the forecast is 32°C today. I'd recommend the faster option.`,
        actions: [
          { label: "Book Dupont HVAC (today, €120)", primary: true, response: "Dupont HVAC is booked for 14:00 today. I've messaged the guest to let them know a technician is coming this afternoon and apologized for the inconvenience.\n\nI'll follow up after the visit to confirm it's fixed." },
          { label: "Book Côte Clim (tomorrow, €95)", response: "Côte Clim booked for tomorrow morning. I've messaged the guest explaining a technician will come first thing tomorrow and apologized for the wait.\n\nGiven the 32°C forecast, want me to offer the guest a portable fan or a discount as a goodwill gesture?" },
          { label: "Message guest first", response: "I'll send a message to the guest acknowledging the issue and asking if they'd prefer a morning or afternoon repair visit. I'll let you know their response so we can book accordingly." },
          { label: "Offer partial refund", response: "What amount would you like to offer? A typical goodwill gesture for AC issues would be €30–50 (one night's discount). I can message the guest with the offer and an apology." },
        ],
      },
      "Studio Promenade": {
        agent: "Finance Agent",
        agentColor: COLORS.green,
        text: `Studio Promenade — Payout blocked.\n\nMarch owner payout for M. Laurent is calculated at €772, but I'm holding it because a cleaning invoice from 22 Mar (€180, cleaner: Sophie R.) is missing.\n\nThis is unusual — Sophie normally submits within 48hrs. Her last invoice was submitted on time on 15 Mar.`,
        actions: [
          { label: "Request invoice from Sophie", primary: true, response: "Message sent to Sophie R. requesting the missing invoice for the Mar 22 clean at Studio Promenade. I've marked it as urgent.\n\nI'll notify you when she responds. If no reply by tomorrow, I'll send a follow-up." },
          { label: "Approve payout without invoice", response: "Payout of €772 released to M. Laurent. I've noted the missing €180 invoice — if Sophie submits it later, it'll be applied to next month's reconciliation.\n\nOwner will receive funds within 2 business days." },
          { label: "Remove expense & recalculate", response: "Recalculated: payout is now €952 (€772 + €180 removed expense). This means M. Laurent gets more this month, but if Sophie's invoice comes in later, you'll need to deduct it from next month.\n\nWant me to release at the new amount?" },
          { label: "Contact owner about delay", response: "I'll send M. Laurent a message explaining the payout is delayed due to a pending invoice and that we expect to resolve it within 48 hours. Want me to draft that message for your review first?" },
        ],
      },
      "Maison Cimiez": {
        agent: "Operations Agent",
        agentColor: COLORS.accent,
        text: `Maison Cimiez — All on track.\n\nCheckout today at 10:00 (6 guests, 7-night stay). Cleaner Sophie confirmed for 10:30. This is a large property (4 bedrooms) — estimated 2.5hr clean.\n\nNew guest arrives at 16:00. Check-in instructions sent at 08:15. Lockbox code updated.\n\nNo issues flagged.`,
        actions: [
          { label: "View cleaning checklist", response: "Maison Cimiez cleaning checklist (4-bedroom):\n\n• Strip & remake all 4 beds (king linens x2, queen x1, twin x1)\n• Deep clean 3 bathrooms + guest WC\n• Kitchen: empty fridge, run dishwasher, wipe all surfaces\n• Vacuum & mop all rooms\n• Restock: towels, toiletries, coffee pods, welcome basket\n• Terrace: sweep, wipe furniture, check pool area\n\nSophie has completed this property 12 times — she knows the drill." },
          { label: "View incoming guest details", response: "Incoming guest: Jean-Marc & family\n• 4 guests (2 adults, 2 children)\n• 5-night stay (Apr 6–11)\n• Booking: €3,780 via Airbnb\n• Special requests: baby cot (already set up), late checkout on Apr 11 if possible\n• Guest rating: 4.9★ (23 reviews)\n• Check-in: 16:00, lockbox code sent" },
          { label: "Send checkout reminder to guest", response: "Checkout reminder sent to the current guest — friendly message reminding them of 10:00 checkout, asking them to leave keys in the lockbox, and thanking them for their stay.\n\nI've also included a link to leave a review." },
        ],
      },
      "Apt. Libération": {
        agent: "Guest Comms Agent",
        agentColor: COLORS.blue,
        text: `Apt. Libération — Running smoothly.\n\nDay 3 of 5 for current guest (3 occupants). No issues reported. I've handled 2 messages from this guest automatically:\n• WiFi password request (yesterday 19:22)\n• Restaurant recommendation (yesterday 20:15)\n\nCheckout is Apr 4 at 10:00. Next booking starts same day at 16:00 — turnover already scheduled with cleaner Marc.`,
        actions: [
          { label: "View guest messages", response: "Messages handled for Apt. Libération:\n\n19:22 — Guest: \"What's the WiFi password?\"\n→ Auto-replied: \"The WiFi network is 'Liberation-Guest', password: Welcome2024! It's also on the card by the router.\"\n\n20:15 — Guest: \"Any good restaurant nearby for dinner?\"\n→ Auto-replied with 3 recommendations: Le Safari (French, 5min walk), Chez Pipo (socca & pizza, 8min), La Rossettisserie (rotisserie, 3min). All rated 4.5+★." },
          { label: "Send mid-stay check-in", response: "Mid-stay message sent: \"Hi! Hope you're enjoying your stay at Apt. Libération. Just checking in — is everything going well? Let us know if you need anything at all. Enjoy the rest of your time in Nice! 😊\"\n\nI'll let you know if they respond." },
          { label: "View turnover schedule", response: "Turnover schedule for Apr 4:\n• Checkout: 10:00\n• Cleaner Marc arrives: 10:30\n• Estimated clean time: 1.5hrs (1-bedroom)\n• Ready by: 12:00\n• Next check-in: 16:00 (4hr buffer)\n\nMarc is confirmed. Linens and supplies are stocked." },
        ],
      },
      "Villa Roses": {
        agent: "Guest Comms Agent",
        agentColor: COLORS.blue,
        text: `Villa Roses — Check-in today.\n\nNew guest arriving at 15:00 (2 occupants, 4-night stay, €380). Check-in instructions sent at 08:15 with lockbox code and welcome info.\n\nProperty was cleaned yesterday (last guest checked out Apr 4). Cleaner rated condition as excellent. No maintenance issues.\n\nThe guest messaged back confirming arrival time.`,
        actions: [
          { label: "View check-in instructions sent", response: "Check-in instructions sent at 08:15:\n\n\"Welcome to Villa Roses! 🌹\n\nAddress: 12 Rue des Roses, Nice\nLockbox location: Left side of front door, code: 4872\nParking: Free spot in the driveway\nWiFi: VillaRoses-Guest / Sunshine2024\n\nCheck-in: anytime after 15:00\nCheckout: 10:00 on Apr 10\n\nWelcome basket with wine, fruit, and local treats is on the kitchen counter. Enjoy your stay!\"\n\nGuest confirmed receipt at 08:32." },
          { label: "Adjust check-in time", response: "What time would you like to change check-in to? The property is already clean and ready, so we can accommodate an earlier arrival if needed. I'll update the guest once you confirm." },
          { label: "Add welcome note", response: "I can add a personalized welcome note. What would you like it to say? Some options:\n\n• General warm welcome\n• Local tips and recommendations\n• Special occasion message (birthday, anniversary)\n\nOr tell me what to write and I'll send it to the guest." },
        ],
      },
    };

    const context = contextMessages[property.name] || {
      agent: "Supervisor",
      agentColor: COLORS.textSecondary,
      text: `${property.name}: ${property.detail}\n\nHow can I help with this property?`,
    };

    setChatMessages([{ role: "agent", ...context }]);
    setPanelTab("chat");
    setPanelOpen(true);
  };

  const crisisProperties = properties.filter((p) => p.urgency === "high" && !handlingIds.has(p.id));
  const mediumProperties = properties.filter((p) => p.urgency === "medium" && !handlingIds.has(p.id));
  const onTrack = properties.filter((p) => p.urgency === "none");
  const pendingActions = messages.filter((m) => !m.resolved).length;

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", backgroundColor: COLORS.bg, color: COLORS.text }}>
      <style>{`
        html, body, #root {
          margin: 0;
          padding: 0;
          height: 100%;
          overflow: hidden;
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(-50%) translateY(8px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>

      {/* ─── Left Nav ─── */}
      <nav style={{ width: 200, backgroundColor: COLORS.white, borderRight: `1px solid ${COLORS.border}`, padding: "16px 0", display: "flex", flexDirection: "column", justifyContent: "space-between", flexShrink: 0 }}>
        <div>
          {/* Brand header */}
          <div style={{ padding: "0 16px 16px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: `linear-gradient(135deg, ${COLORS.accent}, #f07040)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, color: COLORS.white, fontWeight: 700,
              flexShrink: 0,
            }}>
              S
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.text }}>Sunrise</div>
              <div style={{ fontSize: 11, color: COLORS.textSecondary }}>Team Nice</div>
            </div>
            <span style={{ fontSize: 10, color: COLORS.textSecondary }}>⌃</span>
          </div>

          {/* Nav items */}
          <div style={{ padding: "8px 0" }}>
            {[
              { icon: "☀", label: "Today" },
              { icon: "⌂", label: "Properties" },
              { icon: "○", label: "Finances" },
            ].map((item) => (
              <div
                key={item.label}
                onClick={() => { setCurrentPage(item.label); setSelectedAgent(null); setChatMessages(item.label === "Finances" ? financeWelcomeMessages : item.label === "Today" ? todayWelcomeMessages : []); setPanelOpen(true); }}
                style={{
                  padding: "8px 16px",
                  fontSize: 13,
                  fontWeight: currentPage === item.label ? 600 : 400,
                  color: currentPage === item.label ? COLORS.text : COLORS.textSecondary,
                  backgroundColor: currentPage === item.label ? COLORS.bg : "transparent",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  borderRadius: 0,
                }}
              >
                <span style={{ fontSize: 14, width: 18, textAlign: "center" }}>{item.icon}</span>
                {item.label}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom section */}
        <div>
          {/* Agent settings */}
          <div
            onClick={() => { setCurrentPage("Agents"); setSelectedAgent(null); setChatMessages([]); setPanelOpen(true); }}
            style={{
              padding: "10px 16px",
              fontSize: 13,
              fontWeight: currentPage === "Agents" ? 600 : 400,
              color: currentPage === "Agents" ? COLORS.text : COLORS.textSecondary,
              backgroundColor: currentPage === "Agents" ? COLORS.bg : "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 10,
              borderTop: `1px solid ${COLORS.border}`,
            }}
          >
            <span style={{ fontSize: 14, width: 18, textAlign: "center" }}>⚙</span>
            Agent settings
          </div>

          {/* User profile */}
          <div style={{ padding: "12px 16px", borderTop: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              backgroundColor: COLORS.text, color: COLORS.white,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 600, flexShrink: 0,
            }}>
              M
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.text }}>Marie Dubous</div>
              <div style={{ fontSize: 10, color: COLORS.textSecondary }}>Marie@abc.com</div>
            </div>
            <span style={{ fontSize: 10, color: COLORS.textSecondary }}>⌃</span>
          </div>
        </div>
      </nav>

      {/* ─── Main Content ─── */}
      <main style={{ flex: 1, overflow: "hidden", padding: "28px 32px", display: "flex", flexDirection: "column" }}>
        {currentPage === "Finances" ? (
          <div style={{ flex: 1, overflowY: "auto", marginRight: -32, paddingRight: 32 }}>
            <FinancesPage
              reportOpen={reportOpen}
              reportPinned={reportPinned}
              onCloseReport={() => { setReportOpen(false); setReportPinned(false); }}
              onPinReport={() => { setReportPinned(true); setReportOpen(false); }}
              onAskAgent={({ context, title }) => {
                const financeContextMessages = {
                  revenue: {
                    agent: "Finance Agent",
                    agentColor: COLORS.green,
                    text: `Revenue & Profit Trend — June 2025\n\nTotal revenue: €24,680 (+8% vs May). Net profit: €12,450 (+12% vs May). Top performer: Maison Cimiez (€4,280). Lowest: Apt. Port (€2,240).\n\nProfit margin improved from 46% to 50% — driven by lower maintenance costs and higher occupancy across 3 properties.\n\nWhat would you like to know more about?`,
                    actions: [
                      { label: "Break down by property", primary: true, response: "Revenue breakdown by property:\n\n1. Maison Cimiez — €4,280 (17%)\n2. Villa Mimosa — €3,850 (16%)\n3. Loft Vauban — €3,420 (14%)\n4. Studio Promenade — €2,940 (12%)\n5. Apt. Masséna — €2,680 (11%)\n6. Apt. Gambetta — €2,540 (10%)\n7. Villa Roses — €2,490 (10%)\n8. Apt. Port — €2,240 (9%)\n\nMaison Cimiez and Villa Mimosa together account for 33% of total revenue." },
                      { label: "Compare to last quarter", response: "Q2 vs Q1 comparison:\n\n• Revenue: €68,200 vs €52,100 (+31%)\n• Profit: €34,800 vs €24,500 (+42%)\n• Occupancy: 81% vs 68% (+13pts)\n\nSeasonal uplift is the main driver — Nice enters peak tourist season from May. However, 3 properties outperformed seasonal expectations by 15%+, suggesting pricing optimization is working." },
                      { label: "Forecast next month", response: "July forecast based on current bookings + historical patterns:\n\n• Expected revenue: €28,400 (+15% vs June)\n• Expected profit: €14,800\n• Occupancy forecast: 89%\n\nAll properties have 70%+ bookings confirmed for July. Peak pricing is active. I'd recommend reviewing Apt. Port's rate — it's 18% below market for comparable listings." },
                    ],
                  },
                  expenses: {
                    agent: "Finance Agent",
                    agentColor: COLORS.green,
                    text: `Expense Breakdown — June 2025\n\nTotal expenses: €8,730. Cleaning is your largest category at 37% (€3,240), followed by maintenance at 25% (€2,180).\n\nI've noticed cleaning costs are 12% above the seasonal average based on 6 months of data. This is mainly driven by 3 properties using a higher-rate provider.\n\nWant me to dig into any specific category?`,
                    actions: [
                      { label: "Analyse cleaning costs", primary: true, response: "Cleaning cost analysis:\n\n• Sophie R. handles 3 properties at €65/clean — that's 20% above market rate (€52 avg)\n• CleanPro quoted €45/clean for the same properties\n• Express turnovers (between deep cleans) could reduce frequency by 30%\n\nIf you switch to bi-weekly deep cleans + express turnovers: estimated saving €580/mo.\nIf you also switch provider for those 3 properties: additional €360/mo.\n\nTotal potential cleaning savings: €940/mo (29% reduction)." },
                      { label: "Show month-over-month trend", response: "Expense trend (last 6 months):\n\n• Jan: €7,200\n• Feb: €7,450\n• Mar: €7,800\n• Apr: €8,100\n• May: €8,480\n• Jun: €8,730\n\nExpenses have risen 21% since January. Main drivers:\n• Cleaning: +18% (more turnovers as occupancy increased)\n• Maintenance: +35% (AC season + 2 emergency repairs)\n• Platform fees: +12% (proportional to revenue growth)\n\nMaintenance spike is seasonal and expected to normalize in August." },
                      { label: "Compare to industry average", response: "Your expense ratio vs industry benchmarks:\n\n• Your total: 35% of revenue\n• Industry average (Nice, short-term rental): 32%\n• Top performers: 28%\n\nYou're 3pts above average, mainly due to cleaning costs. Maintenance and platform fees are in line. Reducing cleaning costs by the suggested €580/mo would bring you to 33% — closer to average." },
                    ],
                  },
                  suggestions: {
                    agent: "Finance Agent",
                    agentColor: COLORS.green,
                    text: `AI Expense Suggestions\n\nI've identified 2 actionable opportunities to reduce your operating costs:\n\n1. **Switch cleaning provider** (High confidence) — Sophie R. charges €65/clean for Apt. Masséna, Gambetta & Port. CleanPro quoted €45/clean with same service level and 4.8★ rating. Saves €360/mo.\n\n2. **Cancel duplicate insurance** (Medium confidence) — Apt. Libération has overlapping appliance cover. The main policy already includes it. Saves €140/mo.\n\nTotal potential: €500/mo. Want details on either suggestion?`,
                    actions: [
                      { label: "Tell me more about CleanPro", primary: true, response: "CleanPro details:\n\n• Rating: 4.8★ (127 reviews)\n• Operating in Nice since 2019\n• Already services 40+ short-term rental properties\n• Standard rate: €45/clean (1-2 bed), €65/clean (3+ bed)\n• Turnaround time: 2hrs for standard, 3hrs for large\n• Insurance: fully covered up to €10,000\n\nThey offer a trial clean at no commitment. Want me to schedule one for Apt. Masséna as a test?" },
                      { label: "Show the insurance overlap", response: "Insurance overlap on Apt. Libération:\n\n• Main policy (AXA Habitation): covers appliances, plumbing, electrical — active since 2022, €45/mo\n• Additional policy (Darty Protect): appliance-only cover added Jan 2025 — €12/mo\n\nThe Darty policy is fully redundant — AXA already covers everything it does, with higher limits. Cancelling saves €140/mo (€12 × 12 months, partial refund available for remaining term).\n\nWant me to draft a cancellation request?" },
                      { label: "Find more savings", response: "Looking deeper across your portfolio...\n\nAdditional opportunities found:\n\n3. **Renegotiate linen service** — Current rate €12/set. Bulk discount at €9/set available from the same provider for 10+ properties. Saves €180/mo.\n\n4. **Optimise platform listing mix** — Apt. Gambetta gets 80% of bookings from Airbnb at 15% commission. Adding Booking.com (12%) and direct booking could reduce blended rate to 11%. Saves ~€120/mo.\n\nTotal with all suggestions: €800/mo potential savings." },
                    ],
                  },
                };
                const ctx = financeContextMessages[context] || { agent: "Finance Agent", agentColor: COLORS.green, text: `${title}\n\nHow can I help you with this?` };
                setChatMessages([{ role: "agent", ...ctx }]);
                setPanelTab("chat");
                setPanelOpen(true);
              }}
            />
          </div>
        ) : currentPage === "Agents" ? (
          <div style={{ flex: 1, overflowY: "auto", marginRight: -32, paddingRight: 32 }}>
            {selectedAgent ? (
              <AgentDetailPage agent={selectedAgent} onBack={() => { setSelectedAgent(null); setChatMessages([]); }} panelOpen={panelOpen} onOpenPanel={() => setPanelOpen(true)} />
            ) : (
              <AgentsPage panelOpen={panelOpen} onOpenPanel={() => setPanelOpen(true)} onSelectAgent={(agent) => {
                setSelectedAgent(agent);
                setPanelOpen(true);
                setPanelTab("chat");
                setChatMessages([]);
              }} />
            )}
          </div>
        ) : currentPage === "Properties" ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center", padding: 40 }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, backgroundColor: COLORS.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, marginBottom: 16, border: `1px solid ${COLORS.border}` }}>
              ⌂
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 8px", color: COLORS.text }}>
              Properties is coming soon
            </h2>
            <p style={{ fontSize: 13, color: COLORS.textSecondary, margin: 0, maxWidth: 360, lineHeight: 1.5 }}>
              We're building a dedicated view to manage all your properties, listings, and availability in one place.
            </p>
            <div
              onClick={() => { setCurrentPage("Today"); }}
              style={{ marginTop: 20, padding: "8px 16px", fontSize: 13, fontWeight: 500, color: COLORS.accent, backgroundColor: COLORS.accentLight, borderRadius: 6, cursor: "pointer", border: `1px solid ${COLORS.accent}22` }}
            >
              ← Back to Today
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ marginBottom: 24, flexShrink: 0 }}>
              <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: COLORS.text }}>Good morning, Marie</h1>
              <p style={{ fontSize: 13, color: COLORS.textSecondary, margin: "4px 0 0" }}>
                Here is what your agents prepared overnight
              </p>
            </div>

            {/* Stats Row */}
            <div style={{ display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap", flexShrink: 0 }}>
              <StatCard emoji="🔥" label="Needs attention" value={todayStats.needsAttention} />
              <StatCard emoji="🔄" label="Turnovers" value={todayStats.turnovers} sub="1 at risk" subColor={COLORS.yellow} />
              <StatCard emoji="👋" label="Check-ins" value={todayStats.checkInsToday} />
              <StatCard emoji="✨" label="Check-outs" value={todayStats.checkOutsToday} />
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 16, marginBottom: 20, flexShrink: 0 }}>
              {[
                { key: "attention", label: "Needs attention", count: crisisProperties.length + mediumProperties.length },
                { key: "ontrack", label: "On track", count: onTrack.length },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setCardTab(tab.key)}
                  style={{
                    display: "flex", alignItems: "center", gap: 0,
                    padding: "0 0 6px 0", border: "none", backgroundColor: "transparent",
                    cursor: "pointer", fontSize: 14, fontWeight: cardTab === tab.key ? 600 : 400,
                    color: cardTab === tab.key ? COLORS.text : COLORS.textSecondary,
                    borderBottom: cardTab === tab.key ? `2px solid ${COLORS.text}` : "2px solid transparent",
                  }}
                >
                  {tab.label}({tab.count})
                </button>
              ))}
            </div>

            {/* Cards grid */}
            <div style={{ flex: 1, overflowY: "auto", marginRight: -32, paddingRight: 32 }}>
            {(() => {
              const cards = cardTab === "attention"
                ? [...crisisProperties, ...mediumProperties]
                : onTrack;
              if (cardTab === "attention" && cards.length === 0) {
                return (
                  <div style={{
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    padding: "64px 24px", textAlign: "center",
                    backgroundColor: COLORS.white, borderRadius: 12, border: `1.5px solid ${COLORS.greenLight}`,
                  }}>
                    <div style={{ fontSize: 40, marginBottom: 16 }}>☀️</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.text, marginBottom: 6 }}>
                      Everything's handled for today
                    </div>
                    <div style={{ fontSize: 14, color: COLORS.textSecondary, lineHeight: 1.5, maxWidth: 360 }}>
                      All issues have been resolved — your agents are taking care of the rest. Enjoy the rest of your day.
                    </div>
                  </div>
                );
              }
              const sorted = expandedCardId
                ? [
                    ...cards.filter((p) => p.id === expandedCardId),
                    ...cards.filter((p) => p.id !== expandedCardId),
                  ]
                : cards;
              return (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gridAutoRows: "minmax(auto, auto)", gap: 14 }}>
                  {sorted.map((p) => (
                    <PropertyCard
                      key={p.id}
                      property={p}
                      onAskAgent={handleAskAgent}
                      expanded={expandedCardId === p.id}
                      onToggleExpand={(id) => setExpandedCardId(expandedCardId === id ? null : id)}
                      handleDone={handlingIds.has(p.id)}
                      onHandleIt={handleItClick}
                      fadingOut={fadingOutIds.has(p.id)}
                      onApproveAction={handlePropertyApprove}
                    />
                  ))}
                </div>
              );
            })()}

            {/* ─── You're on it section ─── */}
            {handlingIds.size > 0 && (
              <div style={{ marginTop: 28 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>You're on it</span>
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: "1px 7px", borderRadius: 10,
                    backgroundColor: COLORS.greenLight, color: COLORS.green,
                  }}>
                    {handlingIds.size}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {properties.filter((p) => handlingIds.has(p.id)).map((p) => (
                    <div
                      key={p.id}
                      style={{
                        backgroundColor: COLORS.white,
                        borderRadius: 8,
                        border: `1.5px solid ${COLORS.border}`,
                        padding: "14px 18px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        animation: "slideInUp 0.35s ease-out",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>{p.name}</span>
                        <span style={{ fontSize: 13, color: COLORS.textSecondary }}>· {p.statusLabel} · {p.detail.split("·")[0].trim()}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 12, fontWeight: 500, color: COLORS.green }}>✓ You're handling this</span>
                        <button
                          onClick={() => markDone(p.id)}
                          style={{
                            fontSize: 12, fontWeight: 600, padding: "6px 14px", borderRadius: 6,
                            border: "none", backgroundColor: COLORS.text, color: COLORS.white,
                            cursor: "pointer",
                          }}
                        >
                          Mark as done
                        </button>
                        <button
                          onClick={() => handBack(p.id)}
                          style={{
                            fontSize: 12, fontWeight: 500, padding: "6px 14px", borderRadius: 6,
                            border: `1px solid ${COLORS.border}`, backgroundColor: "transparent",
                            color: COLORS.text, cursor: "pointer",
                          }}
                        >
                          Hand back to agent
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            </div>
          </>
        )}
      </main>

      {/* ─── Toast notification ─── */}
      {toastMsg && (
        <div style={{
          position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
          backgroundColor: COLORS.text, color: COLORS.white,
          padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 500,
          boxShadow: "0 4px 16px rgba(0,0,0,0.15)", zIndex: 9999,
          animation: "toastIn 0.25s ease-out",
        }}>
          {toastMsg}
        </div>
      )}

      {/* ─── Right Panel: Chat (default) / Activity tabs ─── */}
      {panelOpen && (
      <aside style={{ width: 340, backgroundColor: COLORS.white, borderLeft: `1px solid ${COLORS.border}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>

        {/* Tab header with expand and close buttons */}
        <div style={{ padding: "10px 14px 0", borderBottom: `1px solid ${COLORS.border}`, flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 0 }}>
              {[
                { key: "chat", label: "Chat" },
                { key: "activity", label: "Agent activity" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setPanelTab(tab.key)}
                  style={{
                    fontSize: 12,
                    fontWeight: panelTab === tab.key ? 600 : 400,
                    padding: "6px 12px", border: "none", backgroundColor: "transparent",
                    color: panelTab === tab.key ? COLORS.text : COLORS.textSecondary,
                    borderBottom: panelTab === tab.key ? `2px solid ${COLORS.text}` : "2px solid transparent",
                    cursor: "pointer", marginBottom: -1,
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <button
                style={{
                  width: 24, height: 24, borderRadius: 4,
                  border: "none", backgroundColor: "transparent",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, color: COLORS.textSecondary,
                }}
                title="Expand panel"
              >
                ⤢
              </button>
              <button
                onClick={() => setPanelOpen(false)}
                style={{
                  width: 24, height: 24, borderRadius: 4,
                  border: "none", backgroundColor: "transparent",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, color: COLORS.textSecondary,
                }}
                title="Close panel"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        {/* ══ AGENT-SPECIFIC PANEL (when viewing agent detail) ══ */}
        {selectedAgent && panelTab === "chat" ? (
          <>
            {/* Agent chat header */}
            <div style={{ padding: "8px 14px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: selectedAgent.color }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: selectedAgent.color }}>{selectedAgent.name}</span>
              <Badge label="Sandbox" bg={COLORS.yellowLight} color={COLORS.yellow} />
              {chatMessages.length > 0 && (
                <button
                  onClick={() => setChatMessages([])}
                  style={{ marginLeft: "auto", fontSize: 10, color: COLORS.textSecondary, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
                >
                  Clear
                </button>
              )}
            </div>
            {/* Chat messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "12px 0" }}>
              {chatMessages.length === 0 ? (
                <div style={{ padding: "30px 16px", textAlign: "center" }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{selectedAgent.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.text, marginBottom: 4 }}>
                    Test {selectedAgent.name}
                  </div>
                  <div style={{ fontSize: 11, color: COLORS.textSecondary, lineHeight: 1.6, marginBottom: 14 }}>
                    Sandbox mode — no real actions taken
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
                    {selectedAgent.chatSuggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          setChatMessages((prev) => [...prev, { role: "user", text: s }]);
                          setTimeout(() => {
                            const matchedKey = Object.keys(selectedAgent.sampleResponses || {}).find(
                              (k) => k.toLowerCase() === s.toLowerCase()
                            );
                            const response = matchedKey
                              ? selectedAgent.sampleResponses[matchedKey]
                              : `I'll handle that. Processing "${s}" now.`;
                            setChatMessages((prev) => [...prev, { role: "agent", agent: selectedAgent.name, agentColor: selectedAgent.color, text: response }]);
                          }, 600);
                        }}
                        style={{
                          fontSize: 11, padding: "6px 10px", borderRadius: 16,
                          border: `1px solid ${COLORS.border}`, backgroundColor: COLORS.white,
                          color: COLORS.text, cursor: "pointer",
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                chatMessages.map((msg, i) => (
                  <div key={i} style={{ padding: "4px 14px" }}>
                    {msg.role === "user" ? (
                      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 4 }}>
                        <div style={{
                          fontSize: 12, padding: "8px 12px", borderRadius: "12px 12px 4px 12px",
                          backgroundColor: COLORS.text, color: COLORS.white, maxWidth: "85%",
                          lineHeight: 1.5, whiteSpace: "pre-wrap",
                        }}>
                          {msg.text}
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 3, marginBottom: 4 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: msg.agentColor || selectedAgent.color }} />
                          <span style={{ fontSize: 10, fontWeight: 600, color: msg.agentColor || selectedAgent.color }}>{msg.agent || selectedAgent.name}</span>
                        </div>
                        <div style={{
                          fontSize: 12, padding: "8px 12px", borderRadius: "4px 12px 12px 12px",
                          backgroundColor: COLORS.bg, color: COLORS.text, maxWidth: "85%",
                          lineHeight: 1.5, whiteSpace: "pre-wrap",
                        }}>
                          {msg.text}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
            {/* Chat input */}
            <div style={{ padding: "8px 12px", borderTop: `1px solid ${COLORS.border}`, flexShrink: 0 }}>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && chatInput.trim()) {
                      const userMsg = chatInput.trim();
                      setChatInput("");
                      setChatMessages((prev) => [...prev, { role: "user", text: userMsg }]);
                      setTimeout(() => {
                        const matchedKey = Object.keys(selectedAgent.sampleResponses || {}).find(
                          (k) => k.toLowerCase() === userMsg.toLowerCase()
                        );
                        const response = matchedKey
                          ? selectedAgent.sampleResponses[matchedKey]
                          : `I'll handle that request. Processing "${userMsg}" now.`;
                        setChatMessages((prev) => [...prev, { role: "agent", agent: selectedAgent.name, agentColor: selectedAgent.color, text: response }]);
                      }, 600);
                    }
                  }}
                  placeholder={`Message ${selectedAgent.name}...`}
                  style={{
                    flex: 1, fontSize: 12, padding: "8px 12px", borderRadius: 6,
                    border: `1px solid ${COLORS.border}`, outline: "none",
                  }}
                />
                <button
                  onClick={() => {
                    if (chatInput.trim()) {
                      const userMsg = chatInput.trim();
                      setChatInput("");
                      setChatMessages((prev) => [...prev, { role: "user", text: userMsg }]);
                      setTimeout(() => {
                        const matchedKey = Object.keys(selectedAgent.sampleResponses || {}).find(
                          (k) => k.toLowerCase() === userMsg.toLowerCase()
                        );
                        const response = matchedKey
                          ? selectedAgent.sampleResponses[matchedKey]
                          : `I'll handle that request. Processing "${userMsg}" now.`;
                        setChatMessages((prev) => [...prev, { role: "agent", agent: selectedAgent.name, agentColor: selectedAgent.color, text: response }]);
                      }, 600);
                    }
                  }}
                  style={{
                    fontSize: 12, fontWeight: 600, padding: "8px 14px", borderRadius: 6,
                    border: "none", backgroundColor: COLORS.text, color: COLORS.white, cursor: "pointer",
                  }}
                >
                  Send
                </button>
              </div>
            </div>
          </>
        ) : selectedAgent && panelTab === "activity" ? (
          /* ══ AGENT-SPECIFIC ACTIVITY ══ */
          <>
            <div style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.border}`, flexShrink: 0, display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: selectedAgent.color }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: selectedAgent.color }}>{selectedAgent.name}</span>
              <span style={{ fontSize: 11, color: COLORS.textSecondary }}>· {selectedAgent.recentActions.length} recent actions</span>
            </div>
            <div style={{ flex: 1, overflowY: "auto" }}>
              {selectedAgent.recentActions.map((a, i) => (
                <div key={i} style={{
                  padding: "10px 14px",
                  borderBottom: `1px solid ${COLORS.border}`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <div style={{
                      width: 6, height: 6, borderRadius: "50%",
                      backgroundColor: a.status === "escalated" ? COLORS.yellow : COLORS.green,
                    }} />
                    <Badge
                      label={a.status === "escalated" ? "Escalated" : "Automatic"}
                      bg={a.status === "escalated" ? COLORS.yellowLight : COLORS.greenLight}
                      color={a.status === "escalated" ? COLORS.yellow : COLORS.green}
                    />
                    <span style={{ fontSize: 10, color: COLORS.textSecondary, marginLeft: "auto" }}>{a.time}</span>
                  </div>
                  <div style={{ fontSize: 12, color: COLORS.text, lineHeight: 1.5 }}>
                    {a.action}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : panelTab === "chat" ? (
          /* ══ DEFAULT CHAT TAB ══ */
          <>
            {/* Chat messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
              {chatMessages.length === 0 ? (
                <div style={{ padding: "30px 20px", textAlign: "center" }}>
                  <div style={{ fontSize: 16, marginBottom: 8 }}>💬</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 4 }}>
                    Chat with your agents
                  </div>
                  <div style={{ fontSize: 12, color: COLORS.textSecondary, lineHeight: 1.6 }}>
                    Ask about property status, reschedule tasks, check financials, or give instructions.
                  </div>

                  {/* Suggestion chips */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginTop: 16 }}>
                    {[
                      "Status of Villa Mimosa?",
                      "How many check-outs today?",
                      "Revenue this month",
                      "Any guest issues?",
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => {
                          setChatMessages((prev) => [...prev, { role: "user", text: suggestion }]);
                          setTimeout(() => {
                            let response = { agent: "Supervisor", agentColor: COLORS.textSecondary, text: "I'll look into that." };
                            if (suggestion.includes("Villa Mimosa")) {
                              response = { agent: "Operations Agent", agentColor: COLORS.accent, text: "Villa Mimosa: turnover at risk. Cleaner Nadia cancelled. Backup Léa is available at 10:30 (25min away). Awaiting your approval on the dashboard. Check-in at 16:00 — timing is tight but workable." };
                            } else if (suggestion.includes("check-out")) {
                              response = { agent: "Operations Agent", agentColor: COLORS.accent, text: "6 check-outs today, all on schedule. Maison Cimiez (10:00), Villa Mimosa (10:00), Studio Promenade (10:00), Apt. Port (11:00), Studio Vieux Nice (11:00), Apt. Garibaldi (—, mid-stay)." };
                            } else if (suggestion.includes("Revenue")) {
                              response = { agent: "Finance Agent", agentColor: COLORS.green, text: "June revenue is €31,240 — up 12% vs May (€29,800). Commission earned: €6,248. Net profit: €22,510 (+16%). Growth is driven by higher occupancy in the villa segment." };
                            } else if (suggestion.includes("guest")) {
                              response = { agent: "Guest Comms Agent", agentColor: COLORS.blue, text: "7 guest messages handled overnight. No pending replies. 4 check-in instructions sent. 1 active issue: Apt. Garibaldi guest reported broken AC — Maintenance Agent is on it." };
                            }
                            setChatMessages((prev) => [...prev, { role: "agent", ...response }]);
                          }, 800);
                        }}
                        style={{
                          fontSize: 11, padding: "6px 10px", borderRadius: 16,
                          border: `1px solid ${COLORS.border}`, backgroundColor: COLORS.white,
                          color: COLORS.text, cursor: "pointer",
                        }}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                chatMessages.map((msg, i) => (
                  <div key={i} style={{ padding: "6px 14px" }}>
                    {msg.role === "user" ? (
                      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 4 }}>
                        <div style={{
                          fontSize: 12, padding: "8px 12px", borderRadius: "12px 12px 4px 12px",
                          backgroundColor: COLORS.text, color: COLORS.white, maxWidth: "85%",
                          lineHeight: 1.5,
                        }}>
                          {msg.text}
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
                        <div style={{
                          width: 22, height: 22, borderRadius: "50%",
                          background: `linear-gradient(135deg, ${COLORS.accent}22, ${COLORS.purple}22)`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 11, color: COLORS.accent, flexShrink: 0, marginTop: 2,
                        }}>✦</div>
                        <div style={{
                          fontSize: 12, padding: 0, borderRadius: 0,
                          backgroundColor: "transparent", color: COLORS.text, maxWidth: "90%",
                          lineHeight: 1.6,
                        }}>
                          {msg.text}

                          {/* Report button */}
                          {msg.showReportButton && (
                            <button
                              onClick={() => { setReportOpen(true); setCurrentPage("Finances"); setChatMessages(financeWelcomeMessages); }}
                              style={{
                                display: "flex", alignItems: "center", gap: 6,
                                padding: "7px 12px", borderRadius: 6,
                                border: `1px solid ${COLORS.border}`, backgroundColor: COLORS.white,
                                cursor: "pointer", fontSize: 11, fontWeight: 600, color: COLORS.text,
                                width: "100%", marginTop: 10,
                              }}
                            >
                              <span style={{ fontSize: 13 }}>📊</span>
                              Open June report on dashboard
                              <span style={{ marginLeft: "auto", color: COLORS.textSecondary }}>→</span>
                            </button>
                          )}

                          {/* Follow-up suggestion chips */}
                          {msg.followUps && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 12 }}>
                              {msg.followUps.map((q) => (
                                <button
                                  key={q}
                                  onClick={() => {
                                    setChatMessages((prev) => [...prev, { role: "user", text: q }]);
                                    setTimeout(() => {
                                      let response = { agent: "Supervisor", agentColor: COLORS.textSecondary, text: "I'll look into that." };
                                      if (q.includes("revenue by property")) {
                                        response = { agent: "Finance Agent", agentColor: COLORS.green, text: "Top 3 by revenue this month:\n1. Maison Cimiez — €7,560 (92% occupancy)\n2. Villa Mimosa — €4,870 (88%)\n3. Villa Paradiso — €3,600 (85%)\n\nBottom 2: Apt. Gambetta (€1,740) and Apt. Port (€2,240) — both under 72% occupancy. I can suggest pricing adjustments if you'd like." };
                                      } else if (q.includes("expense")) {
                                        response = { agent: "Finance Agent", agentColor: COLORS.green, text: "Total expenses are up 3% vs May (€8,730 vs €8,475). Main driver: maintenance jumped 18% due to AC repair at Apt. Garibaldi (€120) and plumbing at Apt. Masséna (€240). Cleaning costs are flat. Platform fees rose slightly with higher booking volume." };
                                      } else if (q.includes("pending payouts")) {
                                        response = { agent: "Finance Agent", agentColor: COLORS.green, text: "2 pending payouts:\n• M. Laurent (Studio Promenade) — €1,820, blocked by missing cleaning invoice from Sophie R. I've sent her a reminder.\n• Mme. Moreau (Villa Roses) — €2,150, waiting on end-of-month reconciliation (due Jul 2).\n\nAll other owners were paid on Jun 28." };
                                      } else if (q.includes("next quarter")) {
                                        response = { agent: "Finance Agent", agentColor: COLORS.green, text: "Q3 forecast (Jul–Sep):\n• Revenue: €104,500 (+22% vs Q2)\n• Net profit: €77,100\n• Peak in August at €37,200\n\nThis assumes 91% avg occupancy during peak season. I've already adjusted pricing on 12 properties to match demand curves. Want me to run a scenario with different assumptions?" };
                                      } else if (q.includes("backup cleaner")) {
                                        response = { agent: "Operations Agent", agentColor: COLORS.accent, text: "Backup cleaner profile:\n\nLea M. — 4.8★ (127 cleans)\n• Distance: 25 min from Villa Mimosa\n• Availability: Can start at 10:30\n• Specialties: Villas, large properties\n• Languages: French, English\n• Reliability: 98% on-time rate\n• Last clean: Yesterday (Apt. Gambetta — 5★ rated)\n\nShe's one of our top-rated backup cleaners in the Nice area." };
                                      } else if (q.includes("turnover schedule")) {
                                        response = { agent: "Operations Agent", agentColor: COLORS.accent, text: "Turnover schedule for Villa Mimosa today:\n\n10:00 — Guest checkout (4 guests, 3-night stay)\n10:30 — Lea arrives for cleaning (backup)\n~13:00 — Estimated cleaning complete\n14:00 — Quality inspection\n16:00 — New guest check-in (4 occupants, 3 nights)\n\nBuffer time: 1.5hrs between clean finish and check-in. Check-in instructions ready to send once turnover confirmed." };
                                      }
                                      setChatMessages((prev) => [...prev, { role: "agent", ...response }]);
                                    }, 800);
                                  }}
                                  style={{
                                    fontSize: 11, padding: "8px 12px", borderRadius: 8,
                                    border: `1px solid ${COLORS.border}`, backgroundColor: COLORS.white,
                                    color: COLORS.text, cursor: "pointer", lineHeight: 1.3,
                                    textAlign: "left", width: "100%",
                                  }}
                                >
                                  {q}
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Action buttons for property context messages */}
                          {msg.actions && !msg.actionsUsed && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 12 }}>
                              {msg.actions.map((action) => (
                                <button
                                  key={action.label}
                                  onClick={() => {
                                    setChatMessages((prev) => prev.map((m, idx) => idx === i ? { ...m, actionsUsed: true } : m));
                                    setChatMessages((prev) => [...prev, { role: "user", text: action.label }]);
                                    setTimeout(() => {
                                      setChatMessages((prev) => [...prev, {
                                        role: "agent",
                                        agent: msg.agent,
                                        agentColor: msg.agentColor,
                                        text: action.response,
                                      }]);
                                    }, 800);
                                  }}
                                  style={{
                                    display: "flex", alignItems: "center", gap: 8,
                                    padding: "8px 12px", borderRadius: 8,
                                    border: action.primary ? "none" : `1px solid ${COLORS.border}`,
                                    backgroundColor: action.primary ? COLORS.text : COLORS.white,
                                    color: action.primary ? COLORS.white : COLORS.text,
                                    cursor: "pointer", fontSize: 11, fontWeight: 600,
                                    textAlign: "left", lineHeight: 1.3,
                                    transition: "all 0.15s ease",
                                  }}
                                  onMouseEnter={(e) => {
                                    if (action.primary) {
                                      e.currentTarget.style.backgroundColor = "#333";
                                    } else {
                                      e.currentTarget.style.backgroundColor = COLORS.bg;
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    if (action.primary) {
                                      e.currentTarget.style.backgroundColor = COLORS.text;
                                    } else {
                                      e.currentTarget.style.backgroundColor = COLORS.white;
                                    }
                                  }}
                                >
                                  {action.label}
                                  <span style={{ marginLeft: "auto", color: action.primary ? "rgba(255,255,255,0.5)" : COLORS.textSecondary, fontSize: 12 }}>→</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Chat input area */}
            <div style={{ padding: "10px 14px", borderTop: `1px solid ${COLORS.border}`, flexShrink: 0 }}>
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && chatInput.trim()) {
                    const userMsg = chatInput.trim();
                    setChatInput("");
                    setChatMessages((prev) => [...prev, { role: "user", text: userMsg }]);
                    setTimeout(() => {
                      let response = { agent: "Supervisor", agentColor: COLORS.textSecondary, text: "I'll look into that for you." };
                      if (userMsg.toLowerCase().includes("villa mimosa") || userMsg.toLowerCase().includes("léa")) {
                        response = { agent: "Operations Agent", agentColor: COLORS.accent, text: "Léa is confirmed and en route. ETA 10:25. She has the door code and cleaning checklist. I'll notify you when she starts." };
                      } else if (userMsg.toLowerCase().includes("checkout") || userMsg.toLowerCase().includes("check-out")) {
                        response = { agent: "Operations Agent", agentColor: COLORS.accent, text: "6 check-outs today, all on schedule. Maison Cimiez (10:00), Villa Mimosa (10:00), Studio Promenade (10:00), Apt. Port (11:00), Studio Vieux Nice (11:00), Apt. Garibaldi (—, mid-stay)." };
                      } else if (userMsg.toLowerCase().includes("revenue") || userMsg.toLowerCase().includes("money") || userMsg.toLowerCase().includes("payout")) {
                        response = { agent: "Finance Agent", agentColor: COLORS.green, text: "March revenue is €24,475, up 8% vs February. 34 owner payouts are ready (€18,220 total). 1 payout on hold for Studio Promenade — missing cleaning invoice." };
                      } else if (userMsg.toLowerCase().includes("guest") || userMsg.toLowerCase().includes("message")) {
                        response = { agent: "Guest Comms Agent", agentColor: COLORS.blue, text: "7 guest messages handled overnight. No pending replies. 4 check-in instructions sent this morning. No complaints or escalations." };
                      } else if (userMsg.toLowerCase().includes("reschedule") || userMsg.toLowerCase().includes("move")) {
                        response = { agent: "Operations Agent", agentColor: COLORS.accent, text: "I can reschedule that. Which property and what's the new time? I'll check cleaner availability and confirm." };
                      }
                      setChatMessages((prev) => [...prev, { role: "agent", ...response }]);
                    }, 800);
                  }
                }}
                placeholder="Ask Supervisor..."
                style={{
                  width: "100%", fontSize: 12, padding: "10px 12px", borderRadius: 8,
                  border: `1px solid ${COLORS.border}`, outline: "none",
                  backgroundColor: COLORS.bg, boxSizing: "border-box",
                }}
              />
            </div>
          </>
        ) : (
          /* ══ DEFAULT ACTIVITY TAB ══ */
          (() => {
            const isFinancePage = currentPage === "Finances";
            const activityItems = isFinancePage ? financeMessages : messages;
            const escalatedItems = activityItems.filter((m) => !m.resolved);
            const autoItems = activityItems.filter((m) => m.resolved);
            return (
            <>
              {/* Activity header */}
              <div style={{ padding: "12px 16px", flexShrink: 0, borderBottom: `1px solid ${COLORS.border}` }}>
                {isFinancePage && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: COLORS.green }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: COLORS.green }}>Finance Agent</span>
                  </div>
                )}
                <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.text }}>
                  {isFinancePage ? "Finance activity" : "Agent activity"}
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                  {escalatedItems.length > 0 && (
                    <span style={{ fontSize: 10, fontWeight: 600, color: COLORS.red, display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: COLORS.red, display: "inline-block" }} />
                      {escalatedItems.length} escalated
                    </span>
                  )}
                  <span style={{ fontSize: 10, fontWeight: 500, color: COLORS.green, display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: COLORS.green, display: "inline-block" }} />
                    {autoItems.length} automatic
                  </span>
                </div>
              </div>

              {/* Activity feed */}
              <div style={{ flex: 1, overflowY: "auto" }}>
                {/* ── Escalated section ── */}
                {escalatedItems.length > 0 && (
                  <div style={{ padding: "8px 10px 0" }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: COLORS.red, textTransform: "uppercase", letterSpacing: 0.5, padding: "4px 6px" }}>
                      Escalated · needs your input
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
                      {escalatedItems.map((m) => {
                        const isExpanded = expandedActivityId === m.id;
                        const isCritical = m.urgency === "high";
                        return (
                        <div
                          key={m.id}
                          onClick={() => setExpandedActivityId(isExpanded ? null : m.id)}
                          style={{
                            backgroundColor: isCritical ? "#fff8f7" : COLORS.white,
                            borderRadius: 8,
                            border: `1.5px solid ${isCritical ? COLORS.red : COLORS.yellow}`,
                            padding: "10px 12px",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                        >
                          {/* Collapsed: compact row */}
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: m.agentColor, flexShrink: 0 }} />
                            <span style={{ fontSize: 11, color: COLORS.textSecondary, flexShrink: 0 }}>{m.agent}</span>
                            <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.text, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: isExpanded ? "normal" : "nowrap" }}>
                              {m.property}
                            </span>
                            <Badge
                              label={m.statusLabel}
                              bg={isCritical ? COLORS.redLight : COLORS.yellowLight}
                              color={isCritical ? COLORS.red : COLORS.yellow}
                            />
                            <span style={{ fontSize: 10, color: COLORS.textSecondary, flexShrink: 0 }}>{m.time}</span>
                          </div>

                          {/* Expanded: full detail */}
                          {isExpanded && (
                            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                              {m.address && (
                                <div style={{ fontSize: 11, color: COLORS.textSecondary }}>{m.address}</div>
                              )}
                              <div style={{ fontSize: 11, color: COLORS.text, lineHeight: 1.5 }}>
                                {m.body}
                              </div>
                              {m.agentDid && (
                                <div style={{
                                  fontSize: 11, color: COLORS.textSecondary, lineHeight: 1.4,
                                  padding: "6px 8px", backgroundColor: COLORS.bg, borderRadius: 5,
                                  borderLeft: `2px solid ${m.agentColor}`,
                                }}>
                                  <span style={{ fontWeight: 600, fontSize: 10, color: m.agentColor, display: "block", marginBottom: 2 }}>
                                    {m.agent} Agent
                                  </span>
                                  {m.agentDid}
                                </div>
                              )}
                              {m.action && (
                                <div style={{ display: "flex", gap: 6, marginTop: 2 }}>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleApprove(m.id); }}
                                    style={{
                                      fontSize: 11, fontWeight: 600, padding: "6px 12px", borderRadius: 6,
                                      border: "none", backgroundColor: COLORS.text, color: COLORS.white, cursor: "pointer",
                                    }}
                                  >
                                    {m.action}
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); setPanelTab("chat"); handleAskAgent({ name: m.property, detail: m.body }); }}
                                    style={{
                                      fontSize: 11, fontWeight: 500, padding: "6px 12px", borderRadius: 6,
                                      border: `1px solid ${COLORS.border}`, backgroundColor: "transparent",
                                      color: COLORS.text, cursor: "pointer",
                                    }}
                                  >
                                    Ask agent
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ── Automatic section ── */}
                {autoItems.length > 0 && (
                  <div style={{ padding: "10px 10px 8px" }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: COLORS.green, textTransform: "uppercase", letterSpacing: 0.5, padding: "4px 6px" }}>
                      Handled automatically
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 4 }}>
                      {autoItems.map((m) => {
                        const isExpanded = expandedActivityId === m.id;
                        return (
                        <div
                          key={m.id}
                          onClick={() => setExpandedActivityId(isExpanded ? null : m.id)}
                          style={{
                            backgroundColor: COLORS.white,
                            borderRadius: 6,
                            border: `1px solid ${COLORS.border}`,
                            padding: "8px 12px",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                        >
                          {/* Collapsed: single compact line */}
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: m.agentColor, flexShrink: 0 }} />
                            <span style={{ fontSize: 11, color: COLORS.textSecondary, flexShrink: 0 }}>{m.agent}</span>
                            <span style={{ fontSize: 11, color: COLORS.text, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: isExpanded ? "normal" : "nowrap" }}>
                              {m.title}
                            </span>
                            <span style={{ fontSize: 10, color: COLORS.textSecondary, flexShrink: 0 }}>{m.time}</span>
                          </div>

                          {/* Expanded: detail */}
                          {isExpanded && (
                            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: m.agentColor }} />
                                <span style={{ fontSize: 10, fontWeight: 600, color: m.agentColor }}>{m.agent} Agent</span>
                                <span style={{ fontSize: 10, color: COLORS.textSecondary }}>· {m.property}</span>
                              </div>
                              <div style={{ fontSize: 11, color: COLORS.textSecondary, lineHeight: 1.5 }}>
                                {m.body}
                              </div>
                              {m.agentDid && (
                                <div style={{
                                  fontSize: 11, color: COLORS.textSecondary, lineHeight: 1.4,
                                  padding: "5px 8px", backgroundColor: COLORS.bg, borderRadius: 4,
                                  borderLeft: `2px solid ${m.agentColor}`,
                                }}>
                                  {m.agentDid}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </>
            );
          })()
        )}
      </aside>
      )}
    </div>
  );
}