
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
                entity.getX() + entity.getWidth() > tile.getX() + 1 &&
                entity.getX() < tile.getX() + tile.getWidth() - 1 &&
                entity.getY() + entity.dy + entity.getHeight() >= tile.getY() &&
                entity.getY() + entity.getHeight() <= tile.getY() + entity.dy + 1;

        case "bottom":
            return entity.dy <= 0 &&
                entity.getX() + entity.getWidth() > tile.getX() &&
                entity.getX() < tile.getX() + tile.getWidth() &&
                entity.getY() <= tile.getY() + tile.getHeight() &&
                entity.getY() >= tile.getY() + tile.getHeight() + entity.dy - 1;

        case "left":
            return entity.dx >= 0 &&
                entity.getX() + entity.dx + entity.getWidth() > tile.getX() &&
                entity.getX() + entity.dx + entity.getWidth() <= tile.getX() + entity.dx + 1 &&
                entity.getY() + entity.getHeight() > tile.getY() &&
                entity.getY() < tile.getY() + tile.getHeight();

        case "right":
            return entity.dx <= 0 &&
                entity.getX() + entity.dx < tile.getX() + tile.getWidth() &&
                entity.getX() + entity.dx >= tile.getX() + tile.getWidth() + entity.dx - 1 &&
                entity.getY() + entity.getHeight() > tile.getY() &&
                entity.getY() < tile.getY() + tile.getHeight();

        default:
            return false;
    }
}