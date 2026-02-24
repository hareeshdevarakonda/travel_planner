import React from "react";
import ActivityCard from "./ActivityCard";

const DaySection = ({ day, items, onDelete }) => {
  return (
    <div>
      <h2 className="text-2xl font-black mb-6">
        Day {day}
      </h2>

      <div className="space-y-4">
        {items
          .sort((a, b) => a.order - b.order)
          .map((item) => (
            <ActivityCard
              key={item.id}
              item={item}
              onDelete={onDelete}
            />
          ))}
      </div>
    </div>
  );
};

export default DaySection;