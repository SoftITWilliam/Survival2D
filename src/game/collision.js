
export function overlap(a,b) {
    return a.x < b.x + b.w &&
        a.x + a.w > b.x &&
        a.y < b.y + b.h &&
        a.y + a.h > b.y;
}

export function surfaceCollision(surface,entity,tile) {
    switch(surface) {
        case "top":
            return entity.dy >= 0 &&
                entity.x + entity.w > tile.x + 1 &&
                entity.x < tile.x + tile.w - 1 &&
                entity.y + entity.dy + entity.h >= tile.y &&
                entity.y + entity.h <= tile.y + entity.dy + 1;

        case "bottom":
            return entity.dy <= 0 &&
                entity.x + entity.w > tile.x &&
                entity.x < tile.x + tile.w &&
                entity.y <= tile.y + tile.h &&
                entity.y >= tile.y + tile.h + entity.dy - 1;

        case "left":
            return entity.dx >= 0 &&
                entity.x + entity.dx + entity.w > tile.x &&
                entity.x + entity.dx + entity.w <= tile.x + entity.dx + 1 &&
                entity.y + entity.h > tile.y &&
                entity.y < tile.y + tile.h;

        case "right":
            return entity.dx <= 0 &&
                entity.x + entity.dx < tile.x + tile.w &&
                entity.x + entity.dx >= tile.x + tile.w + entity.dx - 1 &&
                entity.y + entity.h > tile.y &&
                entity.y < tile.y + tile.h;

        default:
            return false;
    }
}