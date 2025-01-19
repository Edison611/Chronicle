import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CharacterPerspective = () => {
  const { characterName, eventPage } = useParams();
  const [character, setCharacter] = useState(null);
  const [event, setEvent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");

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
    const selectedCharacter = sampleData.characters.find(
      (char) => char.name === characterName
    );
    const selectedEvent = sampleData.timeline.find(
      (event) => event.page === parseInt(eventPage)
    );
    setCharacter(selectedCharacter);
    setEvent(selectedEvent);
  }, [characterName, eventPage]);

  const handleSendMessage = () => {
    if (userInput.trim() !== "") {
      setMessages([...messages, { sender: "user", text: userInput }]);
      // Call API to get response from the character
      setUserInput("");
    }
  };

  if (!character || !event) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold text-center">
        {character.name}'s Perspective
      </h1>

      {/* Perspective Section */}
      <div className="p-6 bg-white shadow-lg rounded-lg space-y-4">
        <h2 className="text-2xl font-semibold">{event.title}</h2>
        <p className="text-gray-700">{event.description}</p>
        <p className="text-gray-700">{character.description}</p>
        <p className="text-gray-700 italic">
          "{character.name}'s perspective at this time: Their unique internal
          thoughts about the event."
        </p>
      </div>

      {/* Chat Section */}
      <div className="p-6 bg-white shadow-lg rounded-lg space-y-4">
        <h2 className="text-xl font-semibold">Chat with {character.name}</h2>
        <div className="h-64 overflow-y-scroll bg-gray-100 p-4 rounded-lg space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`${
                message.sender === "user" ? "text-right" : "text-left"
              }`}
            >
              <span
                className={`inline-block p-3 rounded-lg ${
                  message.sender === "user"
                    ? "bg-blue-100 text-amber-900"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {message.text}
              </span>
            </div>
          ))}
        </div>

        {/* Input Section */}
        <div className="flex space-x-4">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow p-3 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          />
          <button
            onClick={handleSendMessage}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default CharacterPerspective;
