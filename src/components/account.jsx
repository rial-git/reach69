import React, { useEffect, useState } from "react";
import { auth } from "../config/firebase";
import { getCompletedLevels } from "../utils/userProgress";
import "../css/account.css";

export default function Account() {
  const user = auth.currentUser;
  const [completed, setCompleted] = useState([]);

  useEffect(() => {
    if (user) {
      getCompletedLevels().then(setCompleted);
    }
  }, [user]);

  if (!user) return <div className="account-not-logged-in">Not logged in.</div>;

  return (
    <>
    <div className="acc-removal">
        <h2>For accountal removal or any other inquiries mail us: <a href="mailto:contact@rial.xyz">contact@rial.xyz</a> </h2>
    </div>
    <div className="account-page">
      <h2>Account</h2>
      <div>
        <b>Name:</b> {user.displayName || "N/A"}
      </div>
      <div>
        <b>Email:</b> {user.email}
      </div>
      <div className="account-completed-section">
        <h3>Completed Levels</h3>
        {completed.length === 0 ? (
          <div className="account-completed-empty">No levels completed yet.</div>
        ) : (
          <ul className="account-completed-list">
            {completed.map((levelId, i) => (
              <li key={levelId || i}>Level {levelId}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
    </>
  );
}