import { getDistance } from "../utils/distance.js";

const users = {};

const RADIUS = 80; 

export default function handleSocket(io, socket) {
    users[socket.id] = {
        id: socket.id,
        x: 100,
        y: 100,
    };

    io.emit("users:update", users);

    socket.on("move", ({ x, y }) => {
        if (!users[socket.id]) return;

        users[socket.id].x = x;
        users[socket.id].y = y;

        const nearbyUsers = [];

        for (let id in users) {
            if (id === socket.id) continue;

            const distance = getDistance(
                x,
                y,
                users[id].x,
                users[id].y
            );

            if (distance < RADIUS) {
                nearbyUsers.push(id);
            }
        }

        io.emit("users:update", users);

        socket.emit("nearby:users", nearbyUsers);
    });

    socket.on("chat:message", ({ message, to }) => {
        io.to(to).emit("chat:message", {
            from: socket.id,
            message,
        });
    });

    socket.on("disconnect", () => {
        delete users[socket.id];
        io.emit("users:update", users);
    });
}