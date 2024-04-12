export enum Direction {
    Up = 1 << 0,
    Down = 1 << 1,
    Left = 1 << 2,
    Right = 1 << 3,
    UpLeft = (1 << 0) | (1 << 2),
    UpRight = (1 << 0) | (1 << 3),
    DownLeft = (1 << 1) | (1 << 2),
    DownRight = (1 << 1) | (1 << 3),
}
