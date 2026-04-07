type Props = {
    x: number;
    y: number;
    isSelf: boolean;
    isNearby: boolean;
};

export default function Player({ x, y, isSelf, isNearby }: Props) {
    return (
        <div
            style={{
                position: "absolute",
                left: x,
                top: y,
                width: 20,
                height: 20,
                borderRadius: "50%",
                backgroundColor: isSelf ? "blue" : "white",
                border: isNearby ? "3px solid green" : "1px solid gray",
            }}
        />
    );
}