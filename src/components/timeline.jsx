import React from "react";
import { useNavigate } from "react-router-dom";
import { useDrop } from "react-dnd";

const Timeline = ({ event, moveCharacterToTimeline, assignments }) => {
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
    if (!assignments[event.page]) {
      return;
    } else {
      navigate(`/character-perspective/${assignments[event.page][0].name}/${event.page}`);
    }
  };

  return (
    <div
      ref={drop}
      className={`relative p-4 bg-gray-100 rounded-lg shadow-md ${
        isOver ? "bg-gray-300" : "bg-gray-100"
      }`}
      onClick={() => handleClick(event)}
    >
      {/* Timeline line */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"
        style={{ left: "8px" }} // Adjust the position of the line
      ></div>

      {/* Event content */}
      <div className="pl-6"> {/* Add padding to align content with the line */}
        <h3 className="font-bold ml-10">Page {event.page}</h3>
        <p>{event.description}</p>
        <div className="mt-2">
          {assignments[event.page]?.map((char) => (
            <span
              key={char.name}
              className="px-2 py-1 ml-10 bg-blue-200 rounded-full text-sm mr-2"
            >
              {char.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timeline;