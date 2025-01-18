import React, { useState } from "react";
import { useDrop } from "react-dnd";
import { useNavigate } from "react-router-dom";

const Timeline = ({ events, moveCharacterToTimeline, assignments }) => {
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!events || events.length === 0) {
    return <p className="text-gray-600 text-center">No events to display.</p>;
  }

  const selectedEvent = events[selectedIndex];

  const [, drop] = useDrop(() => ({
    accept: "CHARACTER",
    drop: (item) => {
      moveCharacterToTimeline(item.character, event.page);
      navigate(`/test`);
    },
  }));

  return (
    <div className="w-full my-8">
      {/* Horizontal Timeline Bar */}
      <div className="relative flex items-center justify-between w-full h-2 bg-gray-200 rounded-full">
        {events.map((event, index) => (
          <div
            key={index}
            ref={drop} // Attach drop handler to timeline event
            className="relative flex flex-col items-center cursor-pointer"
            onClick={() => setSelectedIndex(index)}
          >
            {/* Timeline Marker */}
            <div
              className={`w-4 h-4 rounded-full ${
                index === selectedIndex ? "bg-green-600" : "bg-gray-400"
              } transition-all duration-300`}
            ></div>
            {/* Event Label */}
            <span className="mt-2 text-sm text-gray-600">{`${event.page}`}</span>
          </div>
        ))}
      </div>

      {/* Character Assignments */}
      <div className="mt-8">
        {assignments[selectedEvent.page]?.map((character, index) => (
          <div
            key={index}
            className="flex items-center space-x-4"
            onClick={() =>
              navigate(
                `/character-perspective/${character.name}/${selectedEvent.page}`
              )
            }
          >
            <div className="p-2 bg-blue-100 rounded-lg shadow-md">
              {character.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
