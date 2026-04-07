type Props = {
    x: number;
    y: number;
    isSelf: boolean;
    isNearby: boolean;
    name: string;
};

export default function Player({ x, y, isSelf, isNearby, name }: Props) {
    const initials = name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <div
            style={{
                position: 'absolute',
                left: `${x}px`,
                top: `${y}px`,
                transform: 'translate(-50%, -50%)',
            }}
            className="flex flex-col items-center gap-1"
        >
            <div
                className={`
          flex items-center justify-center rounded-full font-semibold text-sm
          w-10 h-10
          ${isSelf
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50'
                        : 'bg-slate-500 text-white'
                    }
          ${isNearby ? 'ring-2 ring-green-400 shadow-lg shadow-green-400/30' : 'ring-1 ring-slate-600'}
          transition-all duration-150
        `}
            >
                {initials}
            </div>
            <span className="text-xs text-slate-300 whitespace-nowrap bg-slate-900/80 px-2 py-0.5 rounded">
                {name}
            </span>
        </div>
    );
}
