"use client";

import { useSocket } from "@/hooks/useSocket";
import { socket } from "@/lib/socket";
import { useEffect, useState } from "react";
import Player from "./Player";
import ChatPanel from "./ChatPanel";

type User = {
    id: string;
    x: number;
    y: number;
};

type Message = {
    from: string;
    message: string;
    timestamp: number;
};

export default function GameCanvas({ name }: { name: string }) {
    useSocket();

    const [users, setUsers] = useState<Record<string, User>>({});
    const [nearbyUsers, setNearbyUsers] = useState<string[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [position, setPosition] = useState({ x: 100, y: 100 });
    const [isTyping, setIsTyping] = useState(false);

    const myId = socket.id;

    useEffect(() => {
        socket.on("users:update", (data) => {
            setUsers(data);
        });

        socket.on("nearby:users", (data) => {
            setNearbyUsers(data);
        });

        socket.on("chat:message", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => {
            socket.off("users:update");
            socket.off("nearby:users");
            socket.off("chat:message");
        };
    }, []);

    useEffect(() => {
        if (nearbyUsers.length === 0) {
            setMessages([]);
        }
    }, [nearbyUsers]);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (isTyping) return;

            let { x, y } = position;

            if (e.key === "w" || e.key === "ArrowUp") y -= 5;
            if (e.key === "s" || e.key === "ArrowDown") y += 5;
            if (e.key === "a" || e.key === "ArrowLeft") x -= 5;
            if (e.key === "d" || e.key === "ArrowRight") x += 5;

            const newPos = { x, y };
            setPosition(newPos);

            socket.emit("move", newPos);
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [position, isTyping]);

    const canChat = nearbyUsers.length > 0 && socket.connected;

    return (
        <div className="game-area">
            {Object.values(users).map((user) => (
                <Player
                    key={user.id}
                    x={user.x}
                    y={user.y}
                    isSelf={user.id === myId}
                    isNearby={nearbyUsers.includes(user.id)}
                />
            ))}

            <ChatPanel
                messages={messages}
                canChat={canChat}
                setIsTyping={setIsTyping}
            />
        </div>
    );
}