import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDrag, useDrop } from "react-dnd";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Timeline2 from "./timeline2";

export default function Input() {
  const [story, setStory] = useState("");
  const [characters, setCharacters] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [assignments, setAssignments] = useState({});

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

  return (
    <div className="h-screen flex flex-col">
      <h1 className="text-2xl font-bold text-center p-4">Story Analyzer</h1>

      <div className="flex-1 flex gap-8 p-8">
        {/* Left column with textarea and characters */}
        <div className="w-1/2 flex flex-col gap-8">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <textarea
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="Enter your story here..."
              rows="5"
              className="w-full p-4 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition w-full"
            >
              Analyze Story
            </button>
          </form>

          <DndProvider backend={HTML5Backend}>
            <div>
              <h2 className="text-xl font-bold mb-4">Characters</h2>
              <div className="space-y-4">
                {characters.map((char) => (
                  <DraggableCharacter key={char.name} character={char} />
                ))}
              </div>
            </div>
          </DndProvider>
        </div>

        {/* Right column with timeline */}
        <div className="w-1/2 flex flex-col">
          <h2 className="text-xl font-bold mb-4">Timeline</h2>
          <DndProvider backend={HTML5Backend}>
            <div className="flex-1">
              <Timeline2
                timeline={timeline}
                moveCharacterToTimeline={moveCharacterToTimeline}
                assignments={assignments}
              />
            </div>
          </DndProvider>
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
      className={`p-4 bg-blue-100 rounded-lg shadow-md cursor-pointer ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <h3 className="text-lg font-bold">{character.name}</h3>
      <p className="text-sm">{character.description}</p>
    </div>
  );
};
