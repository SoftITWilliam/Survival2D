
export function overlap(a,b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}

export function surfaceCollision(surface, entity, tile) {
    switch(surface) {
        case "top":
            return entity.dy >= 0 &&
                entity.x2 > tile.x + 1 &&
                entity.x < tile.x2 - 1 &&
                entity.y2 + entity.dy >= tile.y &&
                entity.y2 <= tile.y + entity.dy + 1;

        case "bottom":
            return entity.dy <= 0 &&
                entity.x + entity.width > tile.x &&
                entity.x < tile.x + tile.width &&
                entity.y <= tile.y + tile.height &&
                entity.y >= tile.y + tile.height + entity.dy - 1;

        case "left":
            return entity.dx >= 0 &&
                entity.x + entity.dx + entity.width > tile.x &&
                entity.x + entity.dx + entity.width <= tile.x + entity.dx + 1 &&
                entity.y + entity.height > tile.y &&
                entity.y < tile.y + tile.height;

        case "right":
            return entity.dx <= 0 &&
                entity.x + entity.dx < tile.x + tile.width &&
                entity.x + entity.dx >= tile.x + tile.width + entity.dx - 1 &&
                entity.y + entity.height > tile.y &&
                entity.y < tile.y + tile.height;

        default:
            return false;
    }
}