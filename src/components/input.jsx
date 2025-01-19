import React, { useState, useEffect, useCallback } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useNavigate } from "react-router-dom";
import Timeline2 from "./timeline2";
import './input.css';

export default function Input() {
  const [file, setFile] = useState();
  const [fileContent, setFileContent] = useState([]);

  const [story, setStory] = useState("");
  const [characters, setCharacters] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [assignments, setAssignments] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [data, setData] = useState(null);

  const sampleData = {
    timeline: [
      { page: 1, title: "Event 1", description: "This is the first event." },
      { page: 2, title: "Event 2", description: "This is the second event." },
    ],
    characters: [
      { name: "Person1", description: "He did this" },
      { name: "Person2", description: "She did this" },
    ],
  };

  useEffect(() => {
    setTimeline(sampleData.timeline);
    if (data) {
      setCharacters(data.characters);
    }
  }, [data]);

  const moveCharacterToTimeline = (character, eventPage) => {
    setAssignments((prevAssignments) => ({
      ...prevAssignments,
      [eventPage]: [...(prevAssignments[eventPage] || []), character],
    }));
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  })

    const handleChange = async (e) => {
      const file = e.target.files?.[0];
      if (file && file.type === "application/pdf") {
        try {
          const formData = new FormData();
          formData.append('file', file);
  
          const response = await fetch('http://localhost:5001/api/upload', {
            method: 'POST',
            body: formData,
          });
  
          if (response.ok) {
            const result = await response.json();
            setData(result); // Update the state with the result
            console.log('File uploaded successfully:', result);
          } else {
            console.error('Failed to upload file:', response.statusText);
          }
        } catch (error) {
          console.error('Error uploading PDF:', error);
        }
      } else {
        console.error('Please select a valid PDF file.');
      }
    };

  console.log(data)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-300 to-indigo-400 p-10">
      <div className="w-full flex flex-col space-y-8">
        {/* Header */}
        <h1 className="text-6xl font-extrabold text-center text-white drop-shadow-lg tracking-tight">
          Chronicle
        </h1>

        {/* Main Content - Story, Characters, and Timeline */}
        <div className="flex gap-8 w-full">
          {/* Left Column - Story Input and Character List */}
          <section className="w-1/2 flex flex-col gap-8">
            {/* Story Input */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 hover:scale-105 transition-all">
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <div>
                  <textarea
                    value={story}
                    onChange={(e) => setStory(e.target.value)}
                    placeholder="Enter your story here or drop a PDF file..."
                    rows="7"
                    className="w-full p-4 border-0 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  />

                  {isDragging && (
                    <div className="absolute inset-0 bg-blue-50 bg-opacity-75 flex items-center justify-center rounded-xl border-2 border-dashed border-blue-400">
                      <p className="text-blue-500 font-semibold">
                        Drop PDF here
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center">
                    <form className="form-container">
                    <div className={file ? "input-div-upload" : "input-div"}>
                    <input className="input" name="file" type="file" accept="application/pdf" onChange={handleChange}></input>
                        {!file && <svg className={"icon-upload"} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" stroke-linejoin="round" stroke-linecap="round" viewBox="0 0 24 24" stroke-width="2" fill="none" stroke="currentColor"><polyline points="16 16 12 12 8 16"></polyline><line y2="21" x2="12" y1="12" x1="12"></line><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path><polyline points="16 16 12 12 8 16"></polyline></svg>}
                        {file && <p className="file-selected">{file.name}</p>}
                    </div>
                </form>   
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow-md hover:opacity-90 focus:ring-2 focus:ring-blue-400 transition"
                  >
                    Analyze Story
                  </button>
                </div>
              </form>
            </div>

            {/* Character List */}
            <DndProvider backend={HTML5Backend}>
              <div className="bg-white p-8 rounded-2xl shadow-2xl hover:scale-105 transition-all">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                  Characters
                </h2>
                <div className="h-48 overflow-y-auto border border-gray-300 rounded-lg shadow-inner bg-white">
                  <div className="space-y-4 p-4">
                    {characters.map((char) => (
                      <DraggableCharacter key={char} character={char} />
                    ))}
                  </div>
                </div>
              </div>
            </DndProvider>
          </section>

          {/* Timeline */}
          <section className="w-1/2">
            <h2 className="text-lg font-semibold text-white drop-shadow-md mb-4">
              Timeline
            </h2>

            <DndProvider backend={HTML5Backend}>
              <div className="bg-white p-8 rounded-2xl shadow-2xl hover:scale-105 transition-all">
                <Timeline2
                  timeline={timeline}
                  moveCharacterToTimeline={moveCharacterToTimeline}
                  assignments={assignments}
                />
              </div>
            </DndProvider>
          </section>
        </div>
      </div>
    </div>
  );
}

const DraggableCharacter = ({ character }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "CHARACTER",
    item: { character },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`p-4 bg-gradient-to-r from-blue-100 to-blue-300 rounded-lg shadow-md cursor-pointer transition-all transform ${
        isDragging ? "opacity-50 scale-95" : "hover:scale-105"
      }`}
    >
      <h3 className="text-lg font-bold text-blue-700">{character}</h3>
      {/* <p className="text-sm text-gray-600">{character.description}</p> */}
    </div>
  );
};
