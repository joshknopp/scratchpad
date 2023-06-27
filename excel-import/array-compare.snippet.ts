interface ComparisonResult<T> {
  added: T[];
  removed: T[];
  modified: T[];
}

function compareArrays<T>(original: T[], updated: T[], primaryKey: string): ComparisonResult<T> {
  const originalKeys = new Set(original.map((item) => item[primaryKey]));
  const updatedKeys = new Set(updated.map((item) => item[primaryKey]));

  const added: T[] = [];
  const removed: T[] = [];
  const modified: T[] = [];

  updated.forEach((item) => {
    const key = item[primaryKey];

    if (!originalKeys.has(key)) {
      added.push(item);
    } else {
      const originalItem = original.find((originalItem) => originalItem[primaryKey] === key);
      if (!areObjectsEqual(originalItem, item)) {
        modified.push(item);
      }
    }
  });

  original.forEach((item) => {
    const key = item[primaryKey];

    if (!updatedKeys.has(key)) {
      removed.push(item);
    }
  });

  return { added, removed, modified };
}

function areObjectsEqual(obj1: any, obj2: any): boolean {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}
