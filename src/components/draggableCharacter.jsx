import { useDrag, useDrop, DndProvider } from "react-dnd";

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
            className={`w-full text-left px-4 py-2 text-gray-700 bg-gray-50 hover:bg-blue-50 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 hover:text-blue-600 ${
                isDragging ? "opacity-50 scale-95" : "hover:scale-105"
            }`}
        >
            <h3 className="text-lg font-bold text-blue-700">
                {character.name}
            </h3>
            <p className="text-sm text-gray-600 overflow-ellipsis overflow-hidden whitespace-nowrap h-5 hover:h-auto hover:whitespace-normal hover:overflow-visible">
                {character.summary}
            </p>
        </div>
    );
};

export default DraggableCharacter;
