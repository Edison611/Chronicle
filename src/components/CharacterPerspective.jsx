import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CharacterPerspective = () => {
  const { characterName, eventPage } = useParams();
  const [perspective, setPerspective] = useState("");
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");

  useEffect(() => {
    const fetchPerspective = async () => {
      try {
        let format = {"prompt": "Tell me about your perspective of the story right now", "character": characterName, "page": eventPage, "story": "Romeo and Juliet"}
        const response = await fetch(`http://localhost:5001/api/chat/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(format),
        });
        if (response.ok) {
          const result = await response.json();
          setPerspective(result.response); // Update the state with the result
        } else {
          console.error('Failed to fetch character:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching character:', error);
      }
    };
    fetchPerspective();

  }, []);

  const handleSendMessage = async (e) => {
      try {
        let format = {"prompt": userInput, "character": characterName, "page": eventPage, "story": "Romeo and Juliet"};
        console.log(format)
        const response = await fetch('http://localhost:5001/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(format),
        });

        if (response.ok) {
          const result = await response.json();
          setUserInput("")
          setMessages(result.response); // Update the state with the result
          console.log('File uploaded successfully:', result);
        } else {
          console.error('Failed to upload file:', response.statusText);
        }
      } catch (error) {
        console.error('Error uploading PDF:', error);
      }
    } 
    console.log(messages)

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
          {characterName}'s Perspective
        </h1>

        {/* Perspective Section */}
        <div className="bg-white p-8 rounded-2xl shadow-2xl hover:shadow-inner transition-all transform hover:scale-105">
          <h2 className="text-4xl font-semibold text-blue-600">
            {/* {event.title} */}
          </h2>
          <p className="text-lg mt-4 text-gray-700 leading-relaxed">
            {perspective}
          </p>
          <p className="italic text-gray-600 mt-4">
          </p>
        </div>

        {/* Chat Section */}
        <div className="bg-white p-8 rounded-2xl shadow-2xl hover:shadow-inner transition-all transform hover:scale-105">
          <h2 className="text-3xl font-semibold text-blue-600">
            Chat with {characterName}
          </h2>
          {/* Messages */}
          <div className="h-64 overflow-y-scroll bg-gradient-to-br from-blue-50 to-blue-200 p-6 rounded-xl space-y-4 mt-6">
            
                  {messages}
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
