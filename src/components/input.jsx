import React, { useState, useEffect, useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useNavigate } from "react-router-dom";
import Timeline from "./timeline";
import DraggableCharacter from "./draggableCharacter";
import "./input.css";

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
            { page: 1, title: "Event 1", important: true },
            { page: 2, title: "Event 2", important: false },
            { page: 3, title: "Event 1", important: true },
            { page: 4, title: "Event 2", important: false },
            { page: 5, title: "Event 1", important: true },
            { page: 6, title: "Event 2", important: false },
            { page: 7, title: "Event 1", important: true },
            { page: 8, title: "Event 2", important: false },
        ],
        characters: [
            { name: "Person1", description: "He did this" },
            { name: "Person2", description: "She did this" },
        ],
    };

    useEffect(() => {
        setTimeline(sampleData.timeline);
        setCharacters(sampleData.characters);
    }, [data]);

    const moveCharacterToTimeline = (character, eventPage) => {
        setAssignments((prevAssignments) => ({
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
    });

    const handleChange = async (e) => {
        const file = e.target.files?.[0];
        if (file && file.type === "application/pdf") {
            try {
                const formData = new FormData();
                formData.append("file", file);

                const response = await fetch(
                    "http://localhost:5001/api/upload",
                    {
                        method: "POST",
                        body: formData,
                    }
                );

                if (response.ok) {
                    const result = await response.json();
                    setData(result); // Update the state with the result
                    console.log("File uploaded successfully:", result);
                } else {
                    console.error(
                        "Failed to upload file:",
                        response.statusText
                    );
                }
            } catch (error) {
                console.error("Error uploading PDF:", error);
            }
        } else {
            console.error("Please select a valid PDF file.");
        }
    };

    console.log(data);
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
                        <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-none transition-all">
                            <h2 className="text-lg font-semibold text-black drop-shadow-md mb-4">
                                Choose Story
                            </h2>
                            <form
                                onSubmit={(e) => e.preventDefault()}
                                className="space-y-4"
                            >
                                <div>
                                    <textarea
                                        value={story}
                                        onChange={(e) =>
                                            setStory(e.target.value)
                                        }
                                        placeholder="Enter your story here or drop a PDF file..."
                                        rows="7"
                                        className="w-full p-4 border border-gray-300 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[200px] max-h-[400px]"
                                        onDragEnter={handleDragEnter}
                                        onDragLeave={handleDragLeave}
                                        onDragOver={handleDragOver}
                                        onDrop={handleDrop}
                                    />
                                </div>
                                <div className="flex justify-between items-center">
                                    <button className="flex justify-evenly w-[30%] px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow-md hover:opacity-90 focus:ring-2 focus:ring-blue-400 transition">
                                        <input
                                            className="input"
                                            name="file"
                                            type="file"
                                            accept="application/pdf"
                                            onChange={handleChange}
                                        ></input>
                                        <span class="material-symbols-outlined">
                                            cloud_upload
                                        </span>
                                        Upload
                                    </button>

                                    <button className="flex justify-evenly w-[30%] px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow-md hover:opacity-90 focus:ring-2 focus:ring-blue-400 transition">
                                        <span class="material-symbols-outlined">
                                            check
                                        </span>
                                        Load
                                    </button>

                                    <button className="flex justify-evenly w-[30%] px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full shadow-md hover:opacity-90 focus:ring-2 focus:ring-blue-400 transition">
                                        <span class="material-symbols-outlined">
                                            delete
                                        </span>
                                        Delete
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Character List */}
                        <DndProvider backend={HTML5Backend}>
                            <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-none transition-all">
                                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                                    Characters
                                </h2>
                                <div className="h-48 overflow-y-auto border border-gray-300 rounded-lg shadow-inner bg-white">
                                    <div className="space-y-4 p-4">
                                        {characters.length === 0 ? (
                                            <div className="text-gray-500 text-center py-4">
                                                Nothing to show here
                                            </div>
                                        ) : (
                                            characters.map((char, index) => (
                                                <DraggableCharacter
                                                    key={index}
                                                    character={char}
                                                />
                                            ))
                                        )}
                                    </div>{" "}
                                </div>
                            </div>
                        </DndProvider>
                    </section>

                    {/* Timeline */}
                    <section className="w-1/2">
                        <DndProvider backend={HTML5Backend}>
                            <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-none transition-all h-[100%]">
                                <h2 className="text-lg font-semibold text-black drop-shadow-md mb-4">
                                    Timeline
                                </h2>
                                <div className="relative">
                                    <div className="absolute left-2.5 -top-2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-blue-500"></div>
                                    {timeline.map((event) => (
                                        <Timeline
                                            key={event.page}
                                            event={event}
                                            moveCharacterToTimeline={
                                                moveCharacterToTimeline
                                            }
                                            assignments={assignments}
                                        />
                                    ))}{" "}
                                    <div className="absolute left-2.5 -bottom-2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-blue-500"></div>
                                </div>
                            </div>
                        </DndProvider>
                    </section>
                </div>
            </div>
        </div>
    );
}
