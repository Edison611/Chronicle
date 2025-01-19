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
      setUserInput("");
    }
  };

  if (!character || !event) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-tr from-blue-50 to-blue-100">
        <p className="text-lg text-gray-500 animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-200 via-blue-300 to-indigo-400 p-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <h1 className="text-5xl font-extrabold text-center text-white drop-shadow-md">
          {character.name}'s Perspective
        </h1>

        {/* Perspective Section */}
        <div className="bg-white p-8 rounded-2xl shadow-2xl hover:shadow-inner transition-all transform hover:scale-105">
          <h2 className="text-4xl font-semibold text-blue-600">
            {event.title}
          </h2>
          <p className="text-lg mt-4 text-gray-700 leading-relaxed">
            {event.description}
          </p>
          <p className="text-lg mt-2 text-gray-700">{character.description}</p>
          <p className="italic text-gray-600 mt-4">
            "{character.name}'s unique thoughts on the event go here."
          </p>
        </div>

        {/* Chat Section */}
        <div className="bg-white p-8 rounded-2xl shadow-2xl hover:shadow-inner transition-all transform hover:scale-105">
          <h2 className="text-3xl font-semibold text-blue-600">
            Chat with {character.name}
          </h2>
          {/* Messages */}
          <div className="h-64 overflow-y-scroll bg-gradient-to-br from-blue-50 to-blue-200 p-6 rounded-xl space-y-4 mt-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-5 py-3 rounded-full text-sm font-medium shadow-lg ${
                    message.sender === "user"
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                      : "bg-blue-100 text-gray-900"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Section */}
          <div className="flex items-center mt-6 space-x-4">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-grow px-6 py-4 text-lg border-0 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            <button
              onClick={handleSendMessage}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg rounded-full shadow-lg hover:opacity-90 focus:ring-2 focus:ring-blue-400 transition"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterPerspective;
