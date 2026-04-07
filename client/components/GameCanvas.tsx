'use client';

import { useSocket } from '@/hooks/useSocket';
import { socket } from '@/lib/socket';
import { useEffect, useState } from 'react';
import Player from './Player';
import ChatPanel from './ChatPanel';
import MapZones from './MapZones';

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
    const [position, setPosition] = useState({ x: 200, y: 200 });
    const [isTyping, setIsTyping] = useState(false);
    const [userNames, setUserNames] = useState<Record<string, string>>({});

    const myId = socket.id;

    useEffect(() => {
        socket.on('users:update', (data) => {
            setUsers(data);
        });

        socket.on('nearby:users', (data) => {
            setNearbyUsers(data);
        });

        socket.on('chat:message', (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => {
            socket.off('users:update');
            socket.off('nearby:users');
            socket.off('chat:message');
        };
    }, []);

    useEffect(() => {
        if (myId) {
            setUserNames((prev) => ({
                ...prev,
                [myId]: name,
            }));
        }
    }, [myId, name]);

    useEffect(() => {
        if (nearbyUsers.length === 0) {
            setMessages([]);
        }
    }, [nearbyUsers]);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (isTyping) return;

            let { x, y } = position;
            const step = 8;

            if (e.key === 'w' || e.key === 'ArrowUp') {
                y = Math.max(0, y - step);
                e.preventDefault();
            }
            if (e.key === 's' || e.key === 'ArrowDown') {
                y += step;
                e.preventDefault();
            }
            if (e.key === 'a' || e.key === 'ArrowLeft') {
                x = Math.max(0, x - step);
                e.preventDefault();
            }
            if (e.key === 'd' || e.key === 'ArrowRight') {
                x += step;
                e.preventDefault();
            }

            if (
                (e.key === 'w' || e.key === 's' || e.key === 'a' || e.key === 'd' ||
                    e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight')
            ) {
                const newPos = { x, y };
                setPosition(newPos);
                socket.emit('move', newPos);
            }
        };

        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [position, isTyping]);

    const canChat = nearbyUsers.length > 0 && socket.connected;

    return (
        <div className="flex h-screen bg-slate-950 overflow-hidden">
            <div className="flex-1 relative bg-slate-950">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage:
                            'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)',
                        backgroundSize: '50px 50px',
                    }}
                />

                <MapZones />

                <div className="absolute inset-0 pointer-events-none">
                    {Object.values(users).map((user) => {
                        const displayName = userNames[user.id] || `User-${user.id.slice(0, 4)}`;
                        return (
                            <Player
                                key={user.id}
                                x={user.x}
                                y={user.y}
                                isSelf={user.id === myId}
                                isNearby={nearbyUsers.includes(user.id)}
                                name={displayName}
                            />
                        );
                    })}
                </div>

                <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-300">
                    Users online: {Object.keys(users).length}
                </div>
            </div>

            <ChatPanel messages={messages} canChat={canChat} setIsTyping={setIsTyping} />
        </div>
    );
}
