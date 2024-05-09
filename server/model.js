import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: String,
  content: String,
});

const Note = mongoose.model('Note', noteSchema);
export default Note;