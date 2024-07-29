import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';

const app = express();

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

let db, collection;

// Connect to MongoDB
async function connect() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        db = client.db('db_name');  // Ensure 'db_name' matches the database name in your URI
        collection = db.collection('notes');

        // Start server only after successful DB connection
        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log(`Server started on port ${port}`);
        });
    } catch (e) {
        console.error("Error connecting to MongoDB:", e);
    }
}

connect();

app.use((req, res, next) => {
    if (!db || !collection) {
        console.log('DB connection not established');
        return res.status(503).send({ message: 'Service Unavailable' });
    }
    next();
});

app.delete('/notes/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
            return res.status(400).send({ message: 'Invalid ID format' });
        }
        const objectId = new ObjectId(id);
        const result = await collection.deleteOne({ _id: objectId });
        if (result.deletedCount === 1) {
            res.status(200).send({ message: 'Note deleted successfully' });
        } else {
            res.status(404).send({ message: 'Note not found' });
        }
    } catch (e) {
        console.error('Error deleting note:', e);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.post('/notes', async (req, res) => {
    try {
        const note = req.body;
        console.log('Note received:', note);

        const result = await collection.insertOne(note);
        console.log('Insert result:', result);

        res.status(201).send(result);
    } catch (e) {
        console.error('Error posting note:', e);
        res.status(400).send({ message: 'Post Error' });
    }
});

app.get('/notes', async (req, res) => {
    try {
        const notes = await collection.find().toArray();
        res.status(200).send(notes);
    } catch (e) {
        console.error('Error fetching notes:', e);
        res.status(500).send({ message: 'Error fetching notes' });
    }
});

app.get('/', (req, res) => {
    res.send('Hey this is my API running 🥳');
});

export default app;
