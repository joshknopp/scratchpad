interface TreeNode {
  id: number;
  name: string;
  children?: TreeNode[];
}

function findParents(jsonArray: TreeNode[], selectedObject: TreeNode): TreeNode[] {
  // Helper function to traverse the JSON array recursively
  function traverse(array: TreeNode[], target: TreeNode, path: TreeNode[]): TreeNode[] | null {
    for (const obj of array) {
      // Add current object to the path
      path.push(obj);
      
      // Check if the current object is the selected object
      if (obj === target) {
        // Return the path except the target object itself
        return path.slice(0, -1);
      }
      
      // If the object has children, recursively search in the children
      if (obj.children && obj.children.length > 0) {
        const result = traverse(obj.children, target, path);
        if (result) {
          return result;
        }
      }
      
      // Remove the current object from the path as it's not the correct path
      path.pop();
    }
    return null;
  }
  
  // Start the traversal with an empty path
  return traverse(jsonArray, selectedObject, []) || [];
}

// Example usage
const jsonArray: TreeNode[] = [
  {
    id: 1,
    name: "Parent 1",
    children: [
      {
        id: 2,
        name: "Child 1",
        children: [
          {
            id: 3,
            name: "Grandchild 1"
          }
        ]
      }
    ]
  },
  {
    id: 4,
    name: "Parent 2",
    children: [
      {
        id: 5,
        name: "Child 2"
      }
    ]
  }
];

const selectedObject: TreeNode = jsonArray[0].children![0].children![0];
console.log(findParents(jsonArray, selectedObject)); // Outputs the parent chain of the selected object