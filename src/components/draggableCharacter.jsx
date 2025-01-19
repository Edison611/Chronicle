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
            className={`p-4 bg-gradient-to-r from-blue-100 to-blue-300 rounded-lg shadow-md cursor-pointer transition-all transform ${
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
