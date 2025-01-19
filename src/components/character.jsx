import React from "react";
import { useDrag } from "react-dnd";

const Character = ({ character }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "CHARACTER",
        item: { character },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));

    return (
        <div
            ref={drag} // Attach drag ref to the character
            className="p-4 bg-blue-100 rounded-lg shadow-md cursor-pointer hover:bg-blue-200 transition"
            style={{ opacity: isDragging ? 0.5 : 1 }}
        >
            <h3 className="text-lg font-bold">{character.name}</h3>
            <p className="text-sm">{character.description}</p>
        </div>
    );
};

export default Character;
