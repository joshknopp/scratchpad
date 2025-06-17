# MongoDB Schema Generator and Cleaner

This Node.js script connects directly to a MongoDB database, inspects a specified collection, infers its schema using the `mongodb-schema` library (the same one MongoDB Compass uses), and then cleans the output to remove statistical data (like `values`, `count`, `percentage`) to produce a pure JSON Schema definition suitable for MongoDB's schema validation.

## Features

* **Direct MongoDB Connection:** Connects to your MongoDB instance using details from a `.env` file.
* **Dynamic Collection Selection:** Specify the target collection via a command-line argument.
* **Schema Inference:** Utilizes `mongodb-schema` to analyze your collection's documents and infer their structure and data types (including `bsonType`).
* **Automated Cleanup:** Removes Compass-specific analytical data (like `values` arrays) from the inferred schema.
* **JSON Schema Output:** Generates a clean JSON file (`[collection_name].schema.json`) that can be directly used for MongoDB schema validation rules.

---

## Prerequisites

Before you begin, ensure you have the following installed:

* **Node.js (LTS recommended):** [nodejs.org](https://nodejs.org/)
* **npm (Node Package Manager):** Comes with Node.js
* **MongoDB Instance:** A running MongoDB server you can connect to.

---

## Installation

1.  **Clone or Download:**
    Save the `generateCleanSchema.js` script to your desired project directory.

2.  **Install Dependencies:**
    Navigate to your project directory in the terminal and install the required Node.js packages:

    ```bash
    npm install dotenv mongodb mongodb-schema
    ```

---

## Configuration

1.  **Create a `.env` file:**
    In the same directory as `generateCleanSchema.js`, create a new file named `.env`.

2.  **Add your MongoDB connection details:**
    Populate the `.env` file with your MongoDB connection URI and the database name.

    ```
    MONGODB_URI="mongodb://localhost:27017"
    DB_NAME="yourDatabaseName"
    ```
    * **`MONGODB_URI`**: Your MongoDB connection string.
        * For a local instance: `mongodb://localhost:27017`
        * For Atlas/remote: `mongodb+srv://user:password@cluster.mongodb.net/` (ensure you include the full connection string, potentially with database name if part of the URI)
    * **`DB_NAME`**: The name of the database where your target collection resides.

    **Example `.env` file:**

    ```
    MONGODB_URI="mongodb://localhost:27017"
    DB_NAME="myAppData"
    ```

---

## Usage

Run the script from your terminal, providing the **collection name** as a command-line argument:

```bash
node generateCleanSchema.js <collection_name>
```

Example:

To generate a schema for a collection named products in the database specified in your .env file:

`node generateCleanSchema.js products`

## Output

Upon successful execution, a new file will be created in the same directory, named after your collection, followed by `.schema.json.`

Example Output File Name: products.schema.json

This JSON file will contain the inferred schema, cleaned of statistical data, ready for use with MongoDB's $jsonSchema validator.

## Example Generated Schema (Snippet)

The generated [collection_name].schema.json file will look something like this (structure and content will vary based on your data):

```{
  "bsonType": "object",
  "properties": {
    "_id": {
      "bsonType": "objectId"
    },
    "name": {
      "bsonType": "string",
      "description": "Must be a string and is required"
    },
    "price": {
      "bsonType": "double",
      "description": "Must be a double and is required"
    },
    "tags": {
      "bsonType": "array",
      "items": {
        "bsonType": "string"
      }
    },
    "details": {
      "bsonType": "object",
      "properties": {
        "color": {
          "bsonType": "string"
        },
        "size": {
          "bsonType": "string"
        }
      }
    }
  },
  "required": [
    "_id",
    "name",
    "price"
  ]
}
```

## Applying the Schema for MongoDB Validation

Once you have your [collection_name].schema.json file, you can apply it to your MongoDB collection using collMod (for existing collections) or createCollection (for new ones).

Important: If your schema includes `"additionalProperties": false` at the top level, you must explicitly include _id in your properties and required arrays, even though MongoDB automatically handles it.

## Example: Applying to an Existing Collection in Mongo Shell

Open your generated .schema.json file and copy its content. Paste it inside the $jsonSchema object below.

```
db.runCommand({
   collMod: "yourCollectionName", // <<< CHANGE THIS to your collection name
   validator: {
      $jsonSchema: {
         // PASTE THE CONTENT OF YOUR GENERATED .schema.json FILE HERE
         // For example:
         "bsonType": "object",
         "properties": {
           "_id": { "bsonType": "objectId" },
           "name": { "bsonType": "string" }
           // ... more properties
         },
         "required": ["_id", "name"]
      }
   },
   validationLevel: "strict", // "strict" (default) or "moderate"
   validationAction: "error"  // "error" (default) or "warn"
});
```

Remember to replace "yourCollectionName" and paste the actual content of your generated schema file.

## Customization

 * Sampling Size: You can adjust the size option in the parseSchema function within generateCleanSchema.js to control how many documents are sampled for schema inference. A larger sample provides more accurate inference but takes longer.

```
   const schema = await parseSchema(documentStream, {
    size: 5000 // Sample 5000 documents
});
```

 * Excluded Keys: If you find other statistical keys you want to remove, you can add them to the keysToRemove array in the cleanCompassSchema function.

## License

This project is open-source and available under the MIT License (or choose your preferred license).
