"use client";

import { socket } from "@/lib/socket";
import { useState } from "react";

type Message = {
    from: string;
    message: string;
    timestamp: number;
};

export default function ChatPanel({
    messages,
    canChat,
    setIsTyping,
}: {
    messages: Message[];
    canChat: boolean;
    setIsTyping: (val: boolean) => void;
}) {
    const [input, setInput] = useState("");

    const sendMessage = () => {
        if (!input.trim()) return;

        socket.emit("chat:message", { message: input });
        setInput("");
    };

    return (
        <div
            style={{
                position: "fixed",
                bottom: 0,
                width: "100%",
                background: "#111",
                color: "white",
                padding: 10,
            }}
        >
            <div style={{ maxHeight: 150, overflowY: "auto" }}>
                {messages.map((m, i) => (
                    <div key={i}>
                        <b>{m.from.slice(0, 4)}:</b> {m.message}
                    </div>
                ))}
            </div>

            <input
                disabled={!canChat}
                value={input}
                onFocus={() => setIsTyping(true)}
                onBlur={() => setIsTyping(false)}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                    canChat ? "Type message..." : "Move closer to chat..."
                }
            />

            <button disabled={!canChat} onClick={sendMessage}>
                Send
            </button>
        </div>
    );
}