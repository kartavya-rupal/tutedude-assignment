'use client';

import { socket } from '@/lib/socket';
import { useState, useRef, useEffect } from 'react';

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
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = () => {
        if (!input.trim()) return;
        socket.emit('chat:message', { message: input });
        setInput('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    console.log('Rendering ChatPanel - canChat:', canChat, 'messages:', messages);
    return (
        <div className="fixed right-0 top-0 h-full w-80 bg-slate-900 border-l border-slate-800 flex flex-col shadow-xl">
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800">
                {messages.length === 0 && canChat && (
                    <div className="text-center text-slate-500 text-sm py-8">
                        <p>Start a conversation</p>
                    </div>
                )}
                {messages.map((m, i) => {
                    const initials = m.from.slice(0, 4).toUpperCase();
                    return (
                        <div key={i} className="text-sm">
                            <span className="text-blue-400 font-semibold">{initials}:</span>{' '}
                            <span className="text-slate-200">{m.message}</span>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-slate-800 p-3 space-y-2 bg-slate-950">
                <input
                    disabled={!canChat}
                    value={input}
                    onFocus={() => setIsTyping(true)}
                    onBlur={() => setIsTyping(false)}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={canChat ? 'Type message...' : 'Move closer to chat...'}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-white placeholder-slate-500 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                />
                <button
                    disabled={!canChat || !input.trim()}
                    onClick={sendMessage}
                    className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white text-sm font-medium rounded transition duration-200"
                >
                    Send
                </button>
            </div>
        </div>
    );
}
