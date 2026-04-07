'use client';

import { useState } from 'react';
import GameCanvas from '@/components/GameCanvas';

export default function Page() {
  const [name, setName] = useState('');
  const [joined, setJoined] = useState(false);

  const handleJoin = () => {
    if (name.trim()) {
      setJoined(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleJoin();
    }
  };

  if (!joined) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-slate-900 rounded-xl shadow-2xl p-8 border border-slate-800">
            <h1 className="text-3xl font-bold text-white mb-2 text-center">Virtual Study Space</h1>
            <p className="text-slate-400 text-center mb-8">Collaborate with peers in realtime</p>

            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  autoFocus
                />
              </div>

              <button
                onClick={handleJoin}
                disabled={!name.trim()}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition duration-200"
              >
                Join Study Space
              </button>

              <div className="bg-slate-800 rounded-lg p-4 space-y-3 border border-slate-700">
                <h3 className="text-sm font-semibold text-slate-200">How to Use:</h3>
                <ul className="text-sm text-slate-400 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 font-bold">•</span>
                    <span>Use <span className="font-mono text-slate-300">WASD</span> or <span className="font-mono text-slate-300">Arrow Keys</span> to move</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 font-bold">•</span>
                    <span>Move near others to start chatting</span>
                  </li>
                </ul>
              </div>

              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <h3 className="text-sm font-semibold text-slate-200 mb-2">Community Guidelines:</h3>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li className="flex items-start gap-2">
                    <span className="text-slate-500">•</span>
                    <span>Be respectful to all members</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-500">•</span>
                    <span>Keep conversations relevant to study topics</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <GameCanvas name={name} />;
}
