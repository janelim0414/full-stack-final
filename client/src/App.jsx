import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import axios from 'axios';
import SearchBar from './SearchBar';

function App() {
    // fetch noteslist data from db
    const [noteslist, setNotes] = useState([{}]);
    const [searchResults, setSearchResults] = useState([]);
    useEffect(() => {
        axios
        .get('https://sticky-server.vercel.app/notes')
        .then ((res) => {
            setNotes(res.data);
        })
        .catch((e) => {
            console.log(e);
        });
    }, []);

    const handleSearch = (query) => {
        const results = noteslist.filter((note) =>
            note.title.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(results);
    };

    // incoming note in the input field
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    // // list of notes (intial list from notes.js)
    // const [noteslist, setNotes] = useState(notes);

    function handleTitle(event) {
        setTitle(event.target.value);
    }

    function handleContent(event) {
        setContent(event.target.value);
    }

    // send post request to backend
    function handleClick(event) {

        // send alert if either of the form fields is empty
        if (!title || !content) {
            alert('Note cannot be empty');
            return;
        }
        console.log(title);

        const newNote = {
            title: title,
            content: content
        };
        const newNotes = [...noteslist, newNote];

        axios
        .post('https://sticky-server.vercel.app/notes', newNote)
        .then((res) => {
            setNotes(newNotes);
        })
        .catch((e) => {
            console.log(e);
        })
        
        // reset the form field
        setTitle("");
        setContent("");
    }

    function deleteNote(id) {
        console.log(id);
        axios
        .delete(`https://sticky-server.vercel.app/notes/${id}`)
        .then((res) => {
            const filtered = noteslist.filter((note) => note._id !== id);
            setNotes(filtered);
        })
        .catch((e) => {
            console.error(e);
        })
        
    }

    return (
        <div>
            <Header />
            <SearchBar onSearch={handleSearch} />
            <form className="form">
            <input 
            placeholder="Title" 
            onChange={handleTitle}
            value={title}/>
            <textarea 
            placeholder="Take a note..."
            onChange={handleContent}
            value={content}/>
            <button className="button" onClick={handleClick}>
                Add
            </button>
            </form>
            <div>
                {(searchResults.length > 0 ? searchResults : noteslist).map((note) => {
                    return (
                        <Note
                        key={note._id}
                        id={note._id}
                        title={note.title}
                        content={note.content}
                        delete={() => deleteNote(note._id)}
                        />
                    )
                })}
            </div>
            <Footer />
        </div>
    );
}

export default App;

