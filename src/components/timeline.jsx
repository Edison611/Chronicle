import React from "react";
import { useNavigate } from "react-router-dom";
import { useDrop } from "react-dnd";

const Timeline = ({ event, moveCharacterToTimeline, assignments,story }) => {
    const navigate = useNavigate();

    // useDrop hook for drag-and-drop functionality
    const [{ isOver }, drop] = useDrop(() => ({
        accept: "CHARACTER", // Must match the type used in the draggable component
        drop: (item) => {
            // Call the moveCharacterToTimeline function with the character and chunk_num
            moveCharacterToTimeline(item.character, event.chunk_num);
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(), // Track whether an item is being dragged over this component
        }),
    }));

    // Handle click event to navigate to character perspective
    const handleClick = (event) => {
        if (!assignments[event.chunk_num]) {
            return;
        } else {
            navigate(
                `/character-perspective/${story}/${assignments[event.chunk_num][0].name}/${event.chunk_num}`
            );
        }
    };

    return (
        <div
            ref={drop} // Attach the drop ref to this element
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
            <div className="pl-6">
                {/* Add padding to align content with the line */}
                <h3 className="font-bold ml-10">Section {event.chunk_num}</h3>
                <p>{event.description}</p>
                <div className="mt-2">
                    {assignments[event.chunk_num]?.map((char) => (
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