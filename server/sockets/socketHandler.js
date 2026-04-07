import { getDistance } from "../utils/distance.js";

const users = {};
const RADIUS = 80;

function getNearbyUsers(userId) {
    const user = users[userId];
    if (!user) return [];

    const nearby = [];

    for (let id in users) {
        if (id === userId) continue;

        const other = users[id];
        const distance = getDistance(user.x, user.y, other.x, other.y);

        if (distance < RADIUS) {
            nearby.push(id);
        }
    }

    return nearby;
}

function buildClusters() {
    const visited = new Set();
    const clusters = [];

    function dfs(startId, cluster) {
        visited.add(startId);
        cluster.push(startId);

        for (let id in users) {
            if (visited.has(id)) continue;

            const dist = getDistance(
                users[startId].x,
                users[startId].y,
                users[id].x,
                users[id].y
            );

            if (dist < RADIUS) {
                dfs(id, cluster);
            }
        }
    }

    for (let id in users) {
        if (!visited.has(id)) {
            const cluster = [];
            dfs(id, cluster);
            clusters.push(cluster);
        }
    }

    return clusters;
}

function updateRooms(io) {
    const clusters = buildClusters();

    clusters.forEach(cluster => {
        const roomId =
            cluster.length > 1
                ? `room-${cluster.sort().join("-")}`
                : null;

        cluster.forEach(id => {
            const user = users[id];
            const socketInstance = io.sockets.sockets.get(id);

            if (!socketInstance) return;

            if (user.room && user.room !== roomId) {
                socketInstance.leave(user.room);
                console.log(`${id} left ${user.room}`);
            }

            if (roomId && user.room !== roomId) {
                socketInstance.join(roomId);
                console.log(`${id} joined ${roomId}`);
            }

            user.room = roomId;
        });
    });
}

export default function handleSocket(io, socket) {
    users[socket.id] = {
        id: socket.id,
        x: 100,
        y: 100,
        room: null,
    };

    socket.emit("nearby:users", getNearbyUsers(socket.id));

    io.emit("users:update", users);

    socket.on("move", ({ x, y }) => {
        if (!users[socket.id]) return;

        users[socket.id].x = x;
        users[socket.id].y = y;

        updateRooms(io);

        io.emit("users:update", users);

        for (let id in users) {
            const nearby = getNearbyUsers(id);
            io.to(id).emit("nearby:users", nearby);
        }
    });

    socket.on("chat:message", ({ message }) => {
        const user = users[socket.id];
        if (!user || !user.room) return;

        io.to(user.room).emit("chat:message", {
            from: socket.id,
            message,
            timestamp: Date.now(),
        });
    });

    socket.on("disconnect", () => {
        const user = users[socket.id];

        if (user?.room) {
            socket.leave(user.room);
        }

        delete users[socket.id];

        console.log("User disconnected:", socket.id);

        updateRooms(io);

        for (let id in users) {
            const nearby = getNearbyUsers(id);
            io.to(id).emit("nearby:users", nearby);
        }

        io.emit("users:update", users);
    });
}