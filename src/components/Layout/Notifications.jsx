import React from "react";
import { useAppState } from "../../contexts/AppStateContext";
import "./Notifications.css";

const Notifications = () => {
  const { appState } = useAppState();

  if (appState.notifications.length === 0) {
    return null;
  }

  return (
    <div className="notifications-container">
      {appState.notifications.map((notification) => (
        <div
          key={notification.id}
          className={`notification notification-${notification.type}`}
        >
          <div className="notification-icon">
            {notification.type === "success" && "✅"}
            {notification.type === "error" && "❌"}
            {notification.type === "info" && "ℹ️"}
            {notification.type === "warning" && "⚠️"}
          </div>
          <div className="notification-content">{notification.message}</div>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
