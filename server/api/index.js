import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { MongoClient, ObjectId } from 'mongodb';

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db_pass = "YuVy4Lp7LJHMmnIx";
const uri = `mongodb+srv://jl6094:${db_pass}@fullstackdb.uh0eq66.mongodb.net/`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
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
        const note = await db.collection('notes').insertOne(req.body);
        res.send(note);
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

// Start server
const port = 4000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
