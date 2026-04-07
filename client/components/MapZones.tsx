export default function MapZones() {
    const zones = [
        { name: 'DSA', x: 50, y: 100, width: 280, height: 200, icon: '{ }', bgColor: 'bg-blue-950/30' },
        { name: 'Web Dev', x: 400, y: 100, width: 280, height: 200, icon: '🌐', bgColor: 'bg-purple-950/30' },
        { name: 'System Design', x: 750, y: 100, width: 280, height: 200, icon: '◆', bgColor: 'bg-amber-950/30' },
        { name: 'Databases', x: 50, y: 380, width: 280, height: 200, icon: '⬚', bgColor: 'bg-green-950/30' },
        { name: 'AI / ML', x: 400, y: 380, width: 280, height: 200, icon: '⚡', bgColor: 'bg-red-950/30' },
    ];

    return (
        <div className="absolute inset-0 pointer-events-none">
            {zones.map((zone) => (
                <div
                    key={zone.name}
                    style={{
                        position: 'absolute',
                        left: `${zone.x}px`,
                        top: `${zone.y}px`,
                        width: `${zone.width}px`,
                        height: `${zone.height}px`,
                    }}
                    className={`border border-slate-600/50 rounded-lg backdrop-blur-sm ${zone.bgColor} shadow-inner`}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-lg pointer-events-none" />
                    <div className="absolute top-3 left-4 flex items-center gap-2">
                        <span className="text-lg opacity-60">{zone.icon}</span>
                        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
                            {zone.name}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}
