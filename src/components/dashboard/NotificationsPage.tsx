import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../../integrations/supabase/client";

type NotificationType =
  | "blood_request"
  | "blood_drive"
  | "reminder"
  | "thank_you"
  | "reward"
  | "eligibility";

interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  created_at: string; // ISO
  meta?: Record<string, unknown>; // e.g. { bloodType, location, clinicId, eventDate }
}

const containerStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "300px 1fr 360px",
  gap: 20,
  padding: 20,
  height: "calc(100vh - 100px)",
  boxSizing: "border-box",
};

const panelStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: 8,
  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  padding: 16,
  overflow: "auto",
};

function formatTime(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString();
}

// --- Agentic stubs ---
async function initiateDonorOutreach(notification: NotificationItem) {
  console.log("[agent] initiating outreach for", notification.id);
}
async function planRoutingAndNotify(notification: NotificationItem) {
  console.log("[agent] planning routes for", notification.id);
}

// --- Dummy notifications for dev/demo ---
const dummyNotifications: NotificationItem[] = [
  {
    id: "dummy-1",
    type: "blood_request",
    title: "Urgent O- Blood Needed",
    body: "O- blood urgently required at City Hospital ER.",
    read: false,
    created_at: new Date().toISOString(),
    meta: { bloodType: "O-", location: "City Hospital" },
  },
  {
    id: "dummy-2",
    type: "blood_drive",
    title: "Blood Drive this Weekend",
    body: "Join us for a community blood drive at Central Park Hall.",
    read: false,
    created_at: new Date().toISOString(),
    meta: { date: "2025-10-01", location: "Central Park Hall" },
  },
  {
    id: "dummy-3",
    type: "reminder",
    title: "Time for Your Next Donation",
    body: "You’re eligible to donate again this month. Book an appointment now.",
    read: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "dummy-4",
    type: "thank_you",
    title: "Thank You for Donating",
    body: "Your recent donation helped save 3 lives. We’re grateful!",
    read: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "dummy-5",
    type: "reward",
    title: "You’ve Earned a Badge 🎖️",
    body: "Congratulations! You’ve unlocked the Bronze Donor Badge.",
    read: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "dummy-6",
    type: "eligibility",
    title: "You’re Eligible Again!",
    body: "You’re now cleared to donate blood. Schedule your next donation today.",
    read: false,
    created_at: new Date().toISOString(),
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<NotificationType | "all">("all");

  useEffect(() => {
    setLoading(true);
    const fetchNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from("notifications")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(200);
        if (error) throw error;

        const mapped: NotificationItem[] = (data || []).map((r) => ({
          id: r.id as string,
          type: r.type as NotificationType,
          title: r.title as string,
          body: r.body as string,
          read: r.read as boolean,
          created_at: r.created_at as string,
          meta: r.meta as Record<string, unknown> | undefined,
        }));

        if (mapped.length === 0) {
          setNotifications(dummyNotifications);
          setSelectedId(dummyNotifications[0].id);
        } else {
          setNotifications(mapped);
          setSelectedId(mapped[0].id);
        }
      } catch (err) {
        console.error(err);
        setNotifications(dummyNotifications);
        setSelectedId(dummyNotifications[0].id);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // subscribe to realtime changes
    const channel = supabase
      .channel("public:notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        (payload) => {
          const newRow = payload.new as NotificationItem;
          setNotifications((s) => [newRow, ...s]);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "notifications" },
        (payload) => {
          const updated = payload.new as NotificationItem;
          setNotifications((s) =>
            s.map((n) => (n.id === updated.id ? { ...n, ...updated } : n))
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const counts = useMemo(() => {
    const c: Record<NotificationType, number> = {
      blood_request: 0,
      blood_drive: 0,
      reminder: 0,
      thank_you: 0,
      reward: 0,
      eligibility: 0,
    };
    for (const n of notifications) c[n.type] = (c[n.type] || 0) + 1;
    return c;
  }, [notifications]);

  const filtered = notifications.filter((n) =>
    filter === "all" ? true : n.type === filter
  );
  const selected =
    (selectedId && notifications.find((n) => n.id === selectedId)) ||
    filtered[0] ||
    null;

  async function markAsRead(id: string) {
    try {
      await supabase.from("notifications").update({ read: true }).eq("id", id);
      setNotifications((s) =>
        s.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  }

  async function handleTriggerSOS(n: NotificationItem) {
    setNotifications((s) =>
      s.map((x) => (x.id === n.id ? { ...x, read: true } : x))
    );
    await initiateDonorOutreach(n);
    await planRoutingAndNotify(n);
    await supabase
      .from("notifications")
      .update({ outreach_started: true })
      .eq("id", n.id);
  }

  function typeLabel(t: NotificationType) {
    switch (t) {
      case "blood_request":
        return "Blood Request Alert";
      case "blood_drive":
        return "Upcoming Blood Drive";
      case "reminder":
        return "Donation Reminder";
      case "thank_you":
        return "Thank You Message";
      case "reward":
        return "Reward / Incentive";
      case "eligibility":
        return "Eligibility Update";
    }
  }

  return (
    <div style={containerStyle}>
      {/* Left column: categories */}
      <aside style={{ ...panelStyle, height: "100%" }}>
        <h3 style={{ margin: "0 0 12px 0" }}>Notifications</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button
            onClick={() => setFilter("all")}
            style={{
              textAlign: "left",
              padding: 8,
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            All ({notifications.length})
          </button>
          {(
            [
              "blood_request",
              "blood_drive",
              "reminder",
              "thank_you",
              "reward",
              "eligibility",
            ] as NotificationType[]
          ).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 8,
                border: "none",
                background: filter === t ? "#f2f6ff" : "transparent",
                cursor: "pointer",
              }}
            >
              <span>{typeLabel(t)}</span>
              <strong>{counts[t] || 0}</strong>
            </button>
          ))}
        </div>
      </aside>

      {/* Middle: list */}
      <main style={{ ...panelStyle, height: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <h3 style={{ margin: 0 }}>
            {filter === "all" ? "All Notifications" : typeLabel(filter)}
          </h3>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => {
                setNotifications((s) => s.map((n) => ({ ...n, read: true })));
                supabase.from("notifications").update({ read: true }).neq("id", "");
              }}
            >
              Mark all read
            </button>
            <button onClick={() => setNotifications(dummyNotifications)}>
              Refresh (dummy)
            </button>
          </div>
        </div>

        {loading && <div>Loading...</div>}

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.length === 0 && (
            <div style={{ color: "#666" }}>No notifications found.</div>
          )}
          {filtered.map((n) => (
            <article
              key={n.id}
              style={{
                borderLeft: n.read ? "4px solid transparent" : "4px solid #e11d48",
                padding: 12,
                background: "#fafafa",
                borderRadius: 6,
                cursor: "pointer",
              }}
              onClick={() => {
                setSelectedId(n.id);
                markAsRead(n.id);
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <strong>{n.title}</strong>
                  <div style={{ fontSize: 13, color: "#444" }}>{n.body}</div>
                </div>
                <div style={{ textAlign: "right", fontSize: 12, color: "#666" }}>
                  {formatTime(n.created_at)}
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* Right: detail / actions */}
      <aside style={{ ...panelStyle, height: "100%" }}>
        <h4 style={{ marginTop: 0 }}>Details</h4>
        {!selected && (
          <div style={{ color: "#666" }}>
            Select a notification to view details.
          </div>
        )}
        {selected && (
          <div>
            <h3 style={{ margin: "4px 0" }}>{selected.title}</h3>
            <p style={{ color: "#333" }}>{selected.body}</p>
            <div style={{ fontSize: 13, color: "#555" }}>
              Type: {typeLabel(selected.type)}
            </div>
            <div style={{ fontSize: 13, color: "#555" }}>
              Time: {formatTime(selected.created_at)}
            </div>

            {selected.meta && (
              <div
                style={{
                  marginTop: 12,
                  background: "#f7f7f7",
                  padding: 8,
                  borderRadius: 6,
                }}
              >
                <strong>Details</strong>
                <pre style={{ whiteSpace: "pre-wrap", fontSize: 12 }}>
                  {JSON.stringify(selected.meta, null, 2)}
                </pre>
              </div>
            )}

            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button
                onClick={() => selected && handleTriggerSOS(selected)}
              >
                Trigger SOS & Outreach
              </button>
              <button
                onClick={() => selected && planRoutingAndNotify(selected)}
              >
                Plan Routes
              </button>
              <button onClick={() => selected && markAsRead(selected.id)}>
                Mark read
              </button>
            </div>

            {selected.type === "blood_drive" && (
              <div style={{ marginTop: 12 }}>
                <strong>RSVP / Add to calendar</strong>
                <div style={{ marginTop: 8 }}>
                  <button onClick={() => alert("RSVP recorded (stub)")}>
                    RSVP
                  </button>
                  <button onClick={() => alert("Added to calendar (stub)")}>
                    Add to Calendar
                  </button>
                </div>
              </div>
            )}

            {selected.type === "thank_you" && (
              <div style={{ marginTop: 12 }}>
                <strong>Share</strong>
                <div style={{ marginTop: 8 }}>
                  Share this thank you on social or send to the donor via email.
                </div>
              </div>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}
