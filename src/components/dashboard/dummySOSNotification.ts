// src/components/dashboard/dummySOSNotifications.ts
import { NotificationItem } from "./NotificationsPage";

export const dummySOSNotifications: NotificationItem[] = [
  {
    id: "sos-001",
    type: "blood_request",
    title: "URGENT: A+ Blood Needed at City General",
    body: "Critical shortage! A+ blood required at City General Hospital (ER). Immediate action needed.",
    read: false,
    created_at: new Date().toISOString(),
    meta: {
      bloodType: "A+",
      urgencyLevel: 10,
      hospital: "City General Hospital",
      hospitalLocation: { lat: 28.6139, lon: 77.2090 },
      step: "Trigger Alert"
    }
  },
  {
    id: "sos-002",
    type: "blood_request",
    title: "Eligible Donors Identified",
    body: "Nearby compatible donors have been identified for the A+ blood shortage at City General Hospital.",
    read: false,
    created_at: new Date().toISOString(),
    meta: {
      bloodType: "A+",
      hospital: "City General Hospital",
      donors: [
        { name: "John Doe", distanceKm: 2.3 },
        { name: "Jane Smith", distanceKm: 4.1 }
      ],
      step: "Identify Eligible Donors"
    }
  },
  {
    id: "sos-003",
    type: "blood_request",
    title: "Fastest Routes Calculated",
    body: "Agentic AI has suggested optimal routes for donors to reach City General Hospital quickly.",
    read: false,
    created_at: new Date().toISOString(),
    meta: {
      hospital: "City General Hospital",
      routes: [
        { donor: "John Doe", etaMin: 5, routeUrl: "https://maps.google.com/?q=route1" },
        { donor: "Jane Smith", etaMin: 8, routeUrl: "https://maps.google.com/?q=route2" }
      ],
      step: "Suggest Fastest Routes"
    }
  },
  {
    id: "sos-004",
    type: "blood_request",
    title: "SOS Alert Dispatched",
    body: "Push notifications and SMS sent to all eligible donors with route details and urgency.",
    read: false,
    created_at: new Date().toISOString(),
    meta: {
      hospital: "City General Hospital",
      donorsNotified: ["John Doe", "Jane Smith"],
      step: "Dispatch Alerts"
    }
  },
  {
    id: "sos-005",
    type: "blood_request",
    title: "Donor Responses Tracked",
    body: "System tracking donor confirmations and estimated time of arrival at City General Hospital.",
    read: false,
    created_at: new Date().toISOString(),
    meta: {
      hospital: "City General Hospital",
      responses: [
        { donor: "John Doe", status: "En route", etaMin: 5 },
        { donor: "Jane Smith", status: "Confirmed", etaMin: 8 }
      ],
      step: "Track Response"
    }
  }
];
