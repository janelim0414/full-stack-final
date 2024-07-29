import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { MongoClient, ObjectId } from 'mongodb';

const app = express();

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
let db;

// connect to mongodb
async function connect() {
    try {
        await client.connect();
        db = client.db('test');
        console.log("Connected to MongoDB");
    } catch (e) {
        console.error(e);
    }
}

connect();

// Delete a note
app.delete('/notes/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const objectId = new ObjectId(id);
        const result = await db.collection('notes').deleteOne({ _id: objectId });
        if (result.deletedCount === 1) {
            res.status(200).send({ message: 'Note deleted successfully' });
        } else {
            res.status(404).send({ message: 'Note not found' });
        }
    } catch (e) {
        res.status(500).send({ message: 'Error deleting note' });
    }
});

// Post a note
app.post('/notes', async (req, res) => {
    try {
        const note = req.body;
        console.log('Note received:', note);

        const result = await db.collection('notes').insertOne(note);
        console.log('Insert result:', result);
        
        res.send(result);
    } catch (e) {
        res.status(400).send({ message: 'Post Error' });
    }
});

// Get all notes
app.get('/notes', async (req, res) => {
    try {
        const notes = await db.collection('notes').find().toArray();
        res.send(notes);
    } catch (e) {
        res.status(500).send({ message: 'Error fetching notes' });
    }
});

// Initial get request
app.get('/', (req, res) => {
    res.send('Hey this is my API running 🥳')
})

// Start server
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

export default app;