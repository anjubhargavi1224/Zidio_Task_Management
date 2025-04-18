// App.js
import React, { useState } from "react";
import Meet from "./Meet";

function MeetApp() {
  const [roomName, setRoomName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [startMeeting, setStartMeeting] = useState(false);

  const handleStart = () => {
    if (roomName.trim() !== "" && displayName.trim() !== "") {
      setStartMeeting(true);
    } else {
      alert("Please enter your name and room name");
    }
  };

  return (
    <div style={{ padding: 20, height: '100vh' }}>
      {!startMeeting ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%"
          }}
        >
          <h2>Start or Join ZidioMeet</h2>
          <input
            type="text"
            placeholder="Your Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            style={{ margin: "10px 0", padding: "8px", width: "250px" }}
          />
          <input
            type="text"
            placeholder="Room Name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            style={{ margin: "10px 0", padding: "8px", width: "250px" }}
          />
          <button onClick={handleStart} style={{ padding: "10px 20px" }}>
            ZidioMeet
          </button>
        </div>
      ) : (
        <Meet roomName={roomName} displayName={displayName} />
      )}
    </div>
  );
}

export default MeetApp;
