const { MongoClient } = require('mongodb');
const { parseSchema } = require('mongodb-schema');
const fs = require('fs');
require('dotenv').config(); // Load environment variables from .env file

// --- Configuration from .env ---
const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

// --- Get Collection Name from Command Line Arguments ---
const collectionName = process.argv[2]; // Node.js args start at index 2 (0=node, 1=script_path)

if (!uri || !dbName) {
    console.error("Error: MONGODB_URI and DB_NAME must be set in your .env file.");
    process.exit(1);
}

if (!collectionName) {
    console.error("Usage: node generate.js <collection_name>");
    process.exit(1);
}

// --- Function to clean the schema (from previous script) ---
function cleanCompassSchema(schemaData) {
    if (typeof schemaData === 'object' && schemaData !== null) {
        const keysToRemove = ["values", "count", "percentage", "lengths", "min", "max", "average", "stdDev"];

        for (const key of keysToRemove) {
            if (schemaData.hasOwnProperty(key)) {
                delete schemaData[key];
            }
        }

        for (const key in schemaData) {
            if (schemaData.hasOwnProperty(key)) {
                schemaData[key] = cleanCompassSchema(schemaData[key]);
            }
        }
    } else if (Array.isArray(schemaData)) {
        schemaData = schemaData.map(item => cleanCompassSchema(item));
    }
    return schemaData;
}

// --- Main Function to Generate and Clean Schema ---
async function generateCleanSchema() {
    let client;
    try {
        client = new MongoClient(uri);
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Check if the collection exists
        const collectionExists = await db.listCollections({ name: collectionName }).hasNext();
        if (!collectionExists) {
            console.error(`Error: Collection '${collectionName}' not found in database '${dbName}'.`);
            process.exit(1);
        }

        // Get a cursor for the documents to be sampled
        const documentStream = collection.find({});

        console.log(`Analyzing schema for ${dbName}.${collectionName}...`);

        const schema = await parseSchema(documentStream, {
            // Optional: configure schema inference options
            size: 1000 // Number of documents to sample. Adjust as needed.
        });

        console.log("Schema inferred by mongodb-schema library.");

        // Apply your custom cleaning function
        const cleanedSchema = cleanCompassSchema(schema);

        // --- Dynamic Output File Name ---
        const outputFileName = `${collectionName}.schema.json`;
        fs.writeFileSync(outputFileName, JSON.stringify(cleanedSchema, null, 2));
        console.log(`Cleaned schema saved to ${outputFileName}`);

    } catch (error) {
        console.error("An error occurred:", error);
    } finally {
        if (client) {
            await client.close();
            console.log("MongoDB connection closed.");
        }
    }
}

// Execute the main function
generateCleanSchema();
