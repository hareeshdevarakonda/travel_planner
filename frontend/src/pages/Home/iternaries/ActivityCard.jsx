import React, { useState } from "react";
import { Trash2, MapPin, ChevronDown, ChevronUp } from "lucide-react";

const ActivityCard = ({ item, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  const getImage = (imageData) => {
    if (!imageData) return null;
    if (imageData.startsWith("data:")) return imageData;
    if (imageData.startsWith("http")) return imageData;
    return null;
  };

  const imageUrl = getImage(item.image_data_url);

  return (
    <div className={`bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition ${
      imageUrl ? "flex gap-4" : ""
    }`}>
      {/* Image Section - Only if image exists */}
      {imageUrl && (
        <img
          src={imageUrl}
          className="w-56 h-48 object-cover flex-shrink-0"
          alt={item.place_name}
        />
      )}

      {/* Content Section */}
      <div className={`flex-1 p-5 flex flex-col justify-between ${imageUrl ? "" : ""}`}>
        {/* Header */}
        <div>
          {/* Place Name */}
          <h3 className="font-bold text-xl mb-2">
            {item.place_name}
          </h3>

          {/* Activity Note */}
          {item.note && (
            <p className="text-sm font-semibold text-yellow-600 mb-3 flex items-center gap-2">
              <MapPin size={16} />
              {item.note}
            </p>
          )}

          {/* Description - Collapsible */}
          {item.description && (
            <div className="mt-3">
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-2 text-slate-700 hover:text-slate-900 font-semibold text-sm"
              >
                About this place
                {expanded ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>

              {expanded && (
                <div className="mt-3 text-sm text-slate-600 leading-relaxed max-h-40 overflow-y-auto pr-2">
                  {item.description}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Delete Button */}
        <div className="flex justify-end mt-2">
          <button
            onClick={() => onDelete(item.id)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
            title="Delete activity"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;