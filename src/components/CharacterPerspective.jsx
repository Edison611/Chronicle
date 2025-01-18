import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CharacterPerspective = () => {
  const { characterName, eventPage } = useParams();
  const [character, setCharacter] = useState(null);
  const [event, setEvent] = useState(null);

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

  if (!character || !event) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">{character.name}'s Perspective</h1>
      <h2 className="text-xl">{event.title}</h2>
      <p>{event.description}</p>
      <p>{character.description}</p>
      <p>
        {character.name}'s perspective at this time: {`... (Character's internal thoughts at this event)`}
      </p>
    </div>
  );
};

export default CharacterPerspective;
