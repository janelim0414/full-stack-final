import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import axios from 'axios';
import SearchBar from './SearchBar';

function App() {
    const [noteslist, setNotes] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    useEffect(() => {
        axios.get('https://sticky-server.vercel.app/notes')
            .then(res => setNotes(res.data))
            .catch(e => console.log(e));
    }, []);

    const handleSearch = (query) => {
        const results = noteslist.filter(note =>
            note.title.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(results);
    };

    const handleClick = (event) => {
        event.preventDefault();

        if (!title || !content) {
            alert('Note cannot be empty');
            return;
        }

        const newNote = { title, content };
        console.log("Sending note:", newNote);

        axios.post('https://sticky-server.vercel.app/notes', newNote)
            .then((res) => {
                setNotes([...noteslist, res.data]);
                setTitle("");
                setContent("");
            })
            .catch((e) => {
                console.log(e);
                alert('Error posting note');
            });
    };

    const deleteNote = (id) => {
        axios.delete(`https://sticky-server.vercel.app/notes/${id}`)
            .then(() => {
                setNotes(noteslist.filter(note => note._id !== id));
            })
            .catch((e) => {
                console.error(e);
                alert('Error deleting note');
            });
    };

    return (
        <div>
            <Header />
            <SearchBar onSearch={handleSearch} />
            <form className="form" onSubmit={handleClick}>
                <input 
                    placeholder="Title" 
                    onChange={handleTitle}
                    value={title}
                />
                <textarea 
                    placeholder="Take a note..."
                    onChange={handleContent}
                    value={content}
                />
                <button className="button" type="submit">
                    Add
                </button>
            </form>
            <div>
                {(searchResults.length > 0 ? searchResults : noteslist).map((note) => (
                    <Note
                        key={note._id}
                        id={note._id}
                        title={note.title}
                        content={note.content}
                        delete={() => deleteNote(note._id)}
                    />
                ))}
            </div>
            <Footer />
        </div>
    );
}

export default App;