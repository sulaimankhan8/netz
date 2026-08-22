/**
 * Spatial R-Tree / QuadTree Bounding Box Indexer
 * Provides O(log N) spatial indexing for canvas vector ink strokes.
 * Accelerates hit-testing for erasing, lasso selection, and stroke clustering.
 */

export function intersectsBBox(a, b) {
  return !(a.maxX < b.minX || a.minX > b.maxX || a.maxY < b.minY || a.minY > b.maxY);
}

export function pointInBBox(x, y, bbox, tolerance = 5) {
  return (
    x >= bbox.minX - tolerance &&
    x <= bbox.maxX + tolerance &&
    y >= bbox.minY - tolerance &&
    y <= bbox.maxY + tolerance
  );
}

export class SpatialStrokeIndex {
  constructor(bounds = { minX: -10000, minY: -10000, maxX: 10000, maxY: 10000 }, maxObjects = 10, maxLevels = 5, level = 0) {
    this.bounds = bounds;
    this.maxObjects = maxObjects;
    this.maxLevels = maxLevels;
    this.level = level;
    this.objects = [];
    this.nodes = [];
  }

  clear() {
    this.objects = [];
    for (let i = 0; i < this.nodes.length; i++) {
      if (this.nodes[i]) {
        this.nodes[i].clear();
      }
    }
    this.nodes = [];
  }

  split() {
    const subWidth = (this.bounds.maxX - this.bounds.minX) / 2;
    const subHeight = (this.bounds.maxY - this.bounds.minY) / 2;
    const x = this.bounds.minX;
    const y = this.bounds.minY;

    // Top Right
    this.nodes[0] = new SpatialStrokeIndex(
      { minX: x + subWidth, minY: y, maxX: x + subWidth * 2, maxY: y + subHeight },
      this.maxObjects,
      this.maxLevels,
      this.level + 1
    );

    // Top Left
    this.nodes[1] = new SpatialStrokeIndex(
      { minX: x, minY: y, maxX: x + subWidth, maxY: y + subHeight },
      this.maxObjects,
      this.maxLevels,
      this.level + 1
    );

    // Bottom Left
    this.nodes[2] = new SpatialStrokeIndex(
      { minX: x, minY: y + subHeight, maxX: x + subWidth, maxY: y + subHeight * 2 },
      this.maxObjects,
      this.maxLevels,
      this.level + 1
    );

    // Bottom Right
    this.nodes[3] = new SpatialStrokeIndex(
      { minX: x + subWidth, minY: y + subHeight, maxX: x + subWidth * 2, maxY: y + subHeight * 2 },
      this.maxObjects,
      this.maxLevels,
      this.level + 1
    );
  }

  getIndex(bbox) {
    let index = -1;
    const midX = this.bounds.minX + (this.bounds.maxX - this.bounds.minX) / 2;
    const midY = this.bounds.minY + (this.bounds.maxY - this.bounds.minY) / 2;

    const topQuadrant = bbox.minY < midY && bbox.maxY < midY;
    const bottomQuadrant = bbox.minY > midY;

    if (bbox.minX < midX && bbox.maxX < midX) {
      if (topQuadrant) index = 1;
      else if (bottomQuadrant) index = 2;
    } else if (bbox.minX > midX) {
      if (topQuadrant) index = 0;
      else if (bottomQuadrant) index = 3;
    }

    return index;
  }

  insert(item) {
    if (this.nodes.length) {
      const index = this.getIndex(item.bbox);
      if (index !== -1) {
        this.nodes[index].insert(item);
        return;
      }
    }

    this.objects.push(item);

    if (this.objects.length > this.maxObjects && this.level < this.maxLevels) {
      if (!this.nodes.length) {
        this.split();
      }

      let i = 0;
      while (i < this.objects.length) {
        const index = this.getIndex(this.objects[i].bbox);
        if (index !== -1) {
          const spliced = this.objects.splice(i, 1)[0];
          this.nodes[index].insert(spliced);
        } else {
          i++;
        }
      }
    }
  }

  queryRange(searchBBox, returnObjects = []) {
    const index = this.getIndex(searchBBox);
    if (index !== -1 && this.nodes.length) {
      this.nodes[index].queryRange(searchBBox, returnObjects);
    } else if (this.nodes.length) {
      for (let i = 0; i < this.nodes.length; i++) {
        this.nodes[i].queryRange(searchBBox, returnObjects);
      }
    }

    for (let i = 0; i < this.objects.length; i++) {
      if (intersectsBBox(this.objects[i].bbox, searchBBox)) {
        returnObjects.push(this.objects[i]);
      }
    }

    return returnObjects;
  }

  queryPoint(x, y, tolerance = 10) {
    const searchBBox = {
      minX: x - tolerance,
      minY: y - tolerance,
      maxX: x + tolerance,
      maxY: y + tolerance,
    };

    const candidates = this.queryRange(searchBBox);
    const hits = [];

    for (let i = 0; i < candidates.length; i++) {
      const stroke = candidates[i];
      // Detailed point distance hit test
      for (let j = 0; j < stroke.points.length; j++) {
        const pt = stroke.points[j];
        const dist = Math.hypot(pt.x - x, pt.y - y);
        if (dist <= tolerance + (stroke.width || 3) / 2) {
          hits.push(stroke);
          break;
        }
      }
    }

    return hits;
  }
}
