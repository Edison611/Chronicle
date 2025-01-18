import React from "react";
import { Chrono } from "react-chrono";

const Timeline2 = () => {
  // Your dummy data
  const dummydata = [
    {
      title: "May 1940",
      cardTitle: "Dunkirk",
      cardDetailedText:
        "Men of the British Expeditionary Force (BEF) wade out to a destroyer during the evacuation from Dunkirk.",
    },
    {
      title: "25 July 1940",
      cardTitle: "The Battle of Britain",
      cardDetailedText: "RAF Spitfire pilots scramble for their planes",
    },
    {
      title: "7 December 1941",
      cardTitle: "Pearl Harbor Attack",
      cardDetailedText: "Japanese aircraft attack Pearl Harbor.",
    },
    {
      title: "6 June 1944",
      cardTitle: "D-Day: The Normandy Invasion",
      cardDetailedText: "Allied forces storm the beaches of Normandy.",
    },
    {
      title: "7 May 1945",
      cardTitle: "Victory in Europe (VE) Day",
      cardDetailedText: "Nazi Germany surrenders to the Allies.",
    },
  ];

  return (
    <div className="w-full h-full">
      <Chrono
        items={dummydata}
        mode="VERTICAL"
        cardHeight={200} // Specify card height
        hideControls={true} // Hide navigation controls
        theme={{
          primary: "#4F46E5", // Customize the color scheme
          secondary: "bg-blue-600",
          cardBgColor: "white",
          cardForeColor: "black",
          titleColor: "black",
        }}
        enableBreakPoint // Enables responsive behavior
        showAllCardsHorizontal={false} // Keep cards vertical
        flipLayout={false} // Keep timeline on the left
        useReadMore={false} // Disable read more button
      />
    </div>
  );
};

export default Timeline2;
