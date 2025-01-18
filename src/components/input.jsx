import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDrag, useDrop } from "react-dnd";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
// import Timeline from "./timeline";
// import Character from "./character";

export default function Input() {
  const [story, setStory] = useState("");
  const [characters, setCharacters] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [assignments, setAssignments] = useState(""); // Tracks character assignments to events

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
    setAssignments(() => ({
      [eventPage]: [character],
    }));
  };

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold text-center">Story Analyzer</h1>
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
          className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
        >
          Analyze Story
        </button>
      </form>

      <DndProvider backend={HTML5Backend}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold mb-4">Characters</h2>
            <div className="space-y-4">
              {characters.map((char) => (
                <DraggableCharacter key={char.name} character={char} />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">Timeline</h2>
            <div className="space-y-4">
              {timeline.map((event) => (
                <DroppableTimelineEvent
                  key={event.page}
                  event={event}
                  moveCharacterToTimeline={moveCharacterToTimeline}
                  assignments={assignments}
                />
              ))}
            </div>
          </div>
        </div>
      </DndProvider>
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

const DroppableTimelineEvent = ({ event, moveCharacterToTimeline, assignments }) => {
  const navigate = useNavigate();
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "CHARACTER",
    drop: (item) => {
      moveCharacterToTimeline(item.character, event.page);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const handleClick = (event) => {
    console.log(!assignments[event.page])
    if (!assignments[event.page]) {
      return
    }
    else {
      navigate(`/character-perspective/${assignments[event.page][0].name}/${event.page}`)
    }
  }

  return (
    <div
      ref={drop}
      className={`p-4 bg-gray-100 rounded-lg shadow-md ${
        isOver ? "bg-gray-300" : "bg-gray-100"
      }`}
      onClick={() => handleClick(event)}
    >
      <h3 className="font-bold">{event.title}</h3>
      <p>{event.description}</p>
      <div className="mt-2">
        {assignments[event.page]?.map((char) => (
          <span 
            key={char.name}
            className="px-2 py-1 bg-blue-200 rounded-full text-sm mr-2"
          >
            {char.name}
          </span>
        ))}
      </div>
    </div>
  );
};
