import { getDistance } from "../utils/distance.js";

const users = {};
const RADIUS = 80;

export default function handleSocket(io, socket) {
    users[socket.id] = {
        id: socket.id,
        x: 100,
        y: 100,
        room: null,
    };

    io.emit("users:update", users);

    socket.on("move", ({ x, y }) => {
        if (!users[socket.id]) return;

        users[socket.id].x = x;
        users[socket.id].y = y;

        const currentUser = users[socket.id];

        const nearby = [];

        for (let id in users) {
            if (id === socket.id) continue;

            const other = users[id];

            const distance = getDistance(x, y, other.x, other.y);

            if (distance < RADIUS) {
                nearby.push(id);
            }
        }

        const cluster = [socket.id, ...nearby].sort();

        let newRoom = null;

        if (cluster.length > 1) {
            newRoom = `room-${cluster.join("-")}`;
        }

        if (currentUser.room !== newRoom) {
            if (currentUser.room) {
                socket.leave(currentUser.room);
                console.log(`${socket.id} left ${currentUser.room}`);
            }

            if (newRoom) {
                socket.join(newRoom);
                console.log(`${socket.id} joined ${newRoom}`);
            }

            currentUser.room = newRoom;
        }

        io.emit("users:update", users);
        socket.emit("nearby:users", nearby);
    });

    socket.on("chat:message", ({ message }) => {
        const user = users[socket.id];
        if (!user || !user.room) return;

        io.to(user.room).emit("chat:message", {
            from: socket.id,
            message,
        });
    });

    socket.on("disconnect", () => {
        const user = users[socket.id];

        if (user?.room) {
            socket.leave(user.room);
        }

        delete users[socket.id];

        io.emit("users:update", users);

        console.log("User disconnected:", socket.id);
    });
}