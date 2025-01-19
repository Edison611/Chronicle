import React, { useState, useEffect, useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useNavigate } from "react-router-dom";
import Timeline from "./timeline";
import DraggableCharacter from "./draggableCharacter";
import "./input.css";

export default function Input() {
    const [story, setStory] = useState("");
    const [stories, setStories] = useState([]);
    const [characters, setCharacters] = useState([]);
    const [timeline, setTimeline] = useState([]);
    const [assignments, setAssignments] = useState({});
    const [data, setData] = useState(null);

    useEffect(() => {
        if (data) {
            setCharacters(data.characters);
        }
        if (data) {
            setTimeline(data.contexts);
        }
    }, [data]);

    useEffect(() => {
        getStories();
    }, []);

    const getStories = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/stories");
            if (response.ok) {
                const data = await response.json();
                setStories(data.stories);
            } else {
                console.error("Failed to fetch stories:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching stories:", error);
        }
    };

    const chooseStory = async (index) => {
        setStory(stories[index]);
        try {
            const response = await fetch(
                `http://localhost:5001/api/getstory?index=${index}`
            );
            if (response.ok) {
                const data = await response.json();
                setData(data);
            } else {
                console.error("Failed to fetch story:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching story:", error);
        }
    };

    const moveCharacterToTimeline = (character, eventPage) => {
        setAssignments((prevAssignments) => ({
            [eventPage]: [...(prevAssignments[eventPage] || []), character],
        }));
    };

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-300 to-indigo-400 p-10">
            <div className="w-full flex flex-col space-y-8">
                {/* Header */}
                <h1 className="text-6xl font-extrabold text-center text-white drop-shadow-lg tracking-tight">
                    Chronicle
                </h1>

                {/* Main Content - Story, Characters, and Timeline */}
                <div className="flex gap-8 w-full justify-center">
                    {/* Left Column - Story Input and Character List */}
                    <section className="w-[45%] flex flex-col gap-8">
                        {/* Story Input */}
                        <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-none transition-all">
                            <h2 className="text-lg font-semibold text-black drop-shadow-md mb-4 sticky top-0 z-[1] bg-gray-50 rounded-lg p-2.5 -translate-x-2.5 -translate-y-2.5">
                                Choose Story
                            </h2>
                            <div className="h-48 overflow-y-auto border border-gray-300 rounded-lg shadow-inner bg-white no-scrollbar">
                                <div className="space-y-4 p-4 flex flex-col">
                                    {stories.length === 0 ? (
                                        <div className="text-gray-500 text-center py-4">
                                            Nothing to show here
                                        </div>
                                    ) : (
                                        stories.map((story, index) => (
                                            <button
                                                key={index}
                                                onClick={() =>
                                                    chooseStory(index)
                                                }
                                                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 hover:text-blue-600"
                                            >
                                                {story}.pdf
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-between items-center pt-4">
                                <button className="flex justify-evenly w-[30%] px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow-md hover:opacity-90 focus:ring-2 focus:ring-blue-400 transition">
                                    <input
                                        className="input"
                                        name="file"
                                        type="file"
                                        accept="application/pdf"
                                        onChange={handleChange}
                                    ></input>
                                    <span className="material-symbols-outlined">
                                        cloud_upload
                                    </span>
                                    Upload
                                </button>

                                <button className="flex justify-evenly w-[30%] px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow-md hover:opacity-90 focus:ring-2 focus:ring-blue-400 transition">
                                    <span className="material-symbols-outlined">
                                        check
                                    </span>
                                    Load
                                </button>

                                <button className="flex justify-evenly w-[30%] px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full shadow-md hover:opacity-90 focus:ring-2 focus:ring-blue-400 transition">
                                    <span className="material-symbols-outlined">
                                        delete
                                    </span>
                                    Delete
                                </button>
                            </div>
                        </div>

                        {/* Character List */}
                        <DndProvider backend={HTML5Backend}>
                            <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-none transition-all">
                                <h2 className="text-lg font-semibold text-black drop-shadow-md mb-4 sticky top-0 z-[1] bg-gray-50 rounded-lg p-2.5 -translate-x-2.5 -translate-y-2.5">
                                    Characters
                                </h2>
                                <div className="h-48 overflow-y-auto border border-gray-300 rounded-lg shadow-inner bg-white no-scrollbar">
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
                                    </div>
                                </div>
                            </div>
                        </DndProvider>
                    </section>

                    {/* Timeline */}
                    <section className="w-[45%]">
                        <DndProvider backend={HTML5Backend}>
                            <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-none transition-all h-[745px] overflow-y-auto no-scrollbar">
                                <h2 className="text-lg font-semibold text-black drop-shadow-md mb-4 sticky top-0 z-[1] bg-gray-50 rounded-lg p-2.5 -translate-x-2.5 -translate-y-2.5">
                                    Timeline
                                </h2>
                                <div className="relative">
                                    <div className="absolute left-2.5 -top-2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-blue-500"></div>
                                    {timeline.map((event) => (
                                        <Timeline
                                            key={event.chunk_num}
                                            event={event}
                                            moveCharacterToTimeline={
                                                moveCharacterToTimeline
                                            }
                                            assignments={assignments}
                                            story={story}
                                        />
                                    ))}
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
