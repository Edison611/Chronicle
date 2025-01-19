import React, { useState, useEffect, useCallback } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useNavigate } from "react-router-dom";
import Timeline2 from "./timeline2";

export default function Input() {
  const [story, setStory] = useState("");
  const [characters, setCharacters] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [assignments, setAssignments] = useState({});
  const [isDragging, setIsDragging] = useState(false);

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
    setCharacters(sampleData.characters);
  }, []);

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

    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find((file) => file.type === "application/pdf");

    if (pdfFile) {
      try {
        const text = await pdfFile.text();
        setStory(text);
      } catch (error) {
        console.error("Error reading PDF:", error);
      }
    }
  }, []);

  const handleFileInput = async (e) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      try {
        const text = await file.text();
        setStory(text);
      } catch (error) {
        console.error("Error reading PDF:", error);
      }
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-center py-6 shadow-md">
        <h1 className="text-4xl font-bold">Chronicle</h1>
      </header>

      <main className="flex flex-1 gap-8 p-8">
        {/* Left column: Story input and character list */}
        <section className="w-1/2 flex flex-col gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div>
                <textarea
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  placeholder="Enter your story here or drop a PDF file..."
                  rows="7"
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                />
                {isDragging && (
                  <div className="absolute inset-0 bg-blue-50 bg-opacity-75 flex items-center justify-center rounded-lg border-2 border-dashed border-blue-400">
                    <p className="text-blue-500 font-semibold">Drop PDF here</p>
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center">
                <label
                  htmlFor="pdf-upload"
                  className="text-sm text-blue-600 hover:text-blue-800 underline cursor-pointer"
                >
                  Upload PDF
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileInput}
                  id="pdf-upload"
                  className="hidden"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
                >
                  Analyze Story
                </button>
              </div>
            </form>
          </div>

          <DndProvider backend={HTML5Backend}>
            <div>
              <h2 className="text-lg font-semibold text-gray-700">
                Characters
              </h2>
              <div className="h-48 overflow-y-auto border border-gray-300 rounded-lg shadow-inner bg-white">
                <div className="space-y-4 p-4">
                  {characters.map((char) => (
                    <DraggableCharacter key={char.name} character={char} />
                  ))}
                </div>
              </div>
            </div>
          </DndProvider>
        </section>

        {/* Right column: Timeline */}
        <section className="w-1/2">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Timeline</h2>
          <DndProvider backend={HTML5Backend}>
            <div className="bg-white shadow-md rounded-lg p-4">
              <Timeline2
                timeline={timeline}
                moveCharacterToTimeline={moveCharacterToTimeline}
                assignments={assignments}
              />
            </div>
          </DndProvider>
        </section>
      </main>
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
      className={`p-4 bg-blue-100 rounded-lg shadow-md cursor-pointer transition transform ${
        isDragging ? "opacity-50 scale-95" : "hover:scale-105"
      }`}
    >
      <h3 className="text-lg font-bold text-blue-700">{character.name}</h3>
      <p className="text-sm text-gray-600">{character.description}</p>
    </div>
  );
};
