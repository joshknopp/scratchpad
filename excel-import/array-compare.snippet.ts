interface ComparisonResult {
  added: any[];
  removed: any[];
  modified: any[];
}

function compareArrays(original: any[], updated: any[]): ComparisonResult {
  if (original.length === 0 && updated.length === 0) {
    return { added: [], removed: [], modified: [] };
  }

  const originalKeys = Object.keys(original[0]);
  const updatedKeys = Object.keys(updated[0]);

  if (!areArraysEqual(originalKeys, updatedKeys)) {
    throw new Error('Arrays contain objects with different properties');
  }

  const added = [];
  const removed = [];
  const modified = [];

  original.forEach((originalElement) => {
    const matchingElement = updated.find((updatedElement) =>
      compareObjects(originalElement, updatedElement, originalKeys)
    );

    if (!matchingElement) {
      removed.push(originalElement);
    } else if (!areObjectsEqual(originalElement, matchingElement)) {
      modified.push({ original: originalElement, updated: matchingElement });
    }
  });

  updated.forEach((updatedElement) => {
    const matchingElement = original.find((originalElement) =>
      compareObjects(originalElement, updatedElement, originalKeys)
    );

    if (!matchingElement) {
      added.push(updatedElement);
    }
  });

  return { added, removed, modified };
}

function areArraysEqual(arr1: any[], arr2: any[]): boolean {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (!arr2.includes(arr1[i])) {
      return false;
    }
  }

  return true;
}

function compareObjects(obj1: any, obj2: any, keys: string[]): boolean {
  for (const key of keys) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
}

function areObjectsEqual(obj1: any, obj2: any): boolean {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}
