"use client";

import GameCanvas from "@/components/GameCanvas";
import { useState } from "react";

export default function Page() {
  const [name, setName] = useState("");
  const [joined, setJoined] = useState(false);

  if (!joined) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Enter your name</h2>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={() => setJoined(true)}>Join</button>
      </div>
    );
  }

  return <GameCanvas name={name || "User"} />;
}