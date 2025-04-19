// App.js
import React, { useState } from "react";
import Meet from "./Meet";
import "./Meeting.css"; // assuming you name the CSS file Meeting.css


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
    <div className="meeting-container">
      {!startMeeting ? (
        <div className="meeting-start-box">
          <h2>🚀 Start or Join <span className="zidio">ZidioMeet</span></h2>
  
          <input
            type="text"
            placeholder="Enter your name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="meeting-input"
          />
  
          <input
            type="text"
            placeholder="Enter room name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="meeting-input"
          />
  
          <button onClick={handleStart} className="start-btn">
            Join ZidioMeet
          </button>
        </div>
      ) : (
        <Meet roomName={roomName} displayName={displayName} />
      )}
    </div>
  );
}

export default MeetApp;
