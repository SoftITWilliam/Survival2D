
export function overlap(a,b) {
    return a.getX() < b.getX() + b.getWidth() &&
        a.getX() + a.getWidth() > b.getX() &&
        a.getY() < b.getY() + b.getHeight() &&
        a.getY() + a.getHeight() > b.getY();
}

export function surfaceCollision(surface,entity,tile) {
    switch(surface) {
        case "top":
            return entity.dy >= 0 &&
                entity.x + entity.w > tile.getX() + 1 &&
                entity.x < tile.getX() + tile.getWidth() - 1 &&
                entity.y + entity.dy + entity.h >= tile.getY() &&
                entity.y + entity.h <= tile.getY() + entity.dy + 1;

        case "bottom":
            return entity.dy <= 0 &&
                entity.x + entity.w > tile.getX() &&
                entity.x < tile.getX() + tile.getWidth() &&
                entity.y <= tile.getY() + tile.getHeight() &&
                entity.y >= tile.getY() + tile.getHeight() + entity.dy - 1;

        case "left":
            return entity.dx >= 0 &&
                entity.x + entity.dx + entity.w > tile.getX() &&
                entity.x + entity.dx + entity.w <= tile.getX() + entity.dx + 1 &&
                entity.y + entity.h > tile.getY() &&
                entity.y < tile.getY() + tile.getHeight();

        case "right":
            return entity.dx <= 0 &&
                entity.x + entity.dx < tile.getX() + tile.getWidth() &&
                entity.x + entity.dx >= tile.getX() + tile.getWidth() + entity.dx - 1 &&
                entity.y + entity.h > tile.getY() &&
                entity.y < tile.getY() + tile.getHeight();

        default:
            return false;
    }
}