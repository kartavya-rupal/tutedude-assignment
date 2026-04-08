# Real-Time Proximity Chat System

## Overview
This project implements a real-time proximity-based interaction system using WebSockets. Users move on a shared 2D space and can communicate only with nearby users.

## Core Idea
Instead of handling users pairwise, the system models:
- Users as nodes
- Proximity as edges

DFS is used to find connected components, and each component is treated as a dynamic group.

## Key Features
- Real-time movement sync across clients
- Proximity detection using distance calculation
- Dynamic grouping using DFS (connected components)
- Group-based chat using Socket.IO rooms
- Multi-cluster support (independent groups)

## How It Works
1. Users connect via WebSocket
2. Backend tracks all users and their positions
3. On movement:
   - Distances are calculated
   - Graph is formed
   - DFS finds clusters
4. Each cluster is assigned a room
5. Messages are broadcast only within that room

## Tech Stack
- Frontend: Next.js (App Router), TypeScript, Tailwind
- Backend: Node.js, Express, Socket.IO

## Running the Project

### Backend
- cd server
- npm install
- npm run dev

### Frontend
- cd client
- npm install
- npm run dev

## Known Limitations
- Proximity check is O(n²)
- No persistent chat storage
- Basic UI without animations
- Minor state sync edge cases (e.g. naming)

## Future Improvements
- Spatial partitioning (grid / quadtree) for optimization
- Persistent storage for users/messages
- Improved UI and interaction design
- Better state synchronization strategy
