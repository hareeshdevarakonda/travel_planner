import React from "react";
import { Trash2, MapPin } from "lucide-react";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "";

const getImage = (item) => {
  const url = item.place?.image_url;
  if (!url) return "/placeholder.jpg";

  return url.startsWith("http")
    ? url
    : `${API_BASE}${url}`;
};

const ActivityCard = ({ item, onDelete }) => {
  return (
    <div className="flex gap-5 bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">

      <img
        src={getImage(item)}
        className="w-40 h-32 object-cover"
        alt={item.place?.name}
      />

      <div className="flex-1 p-4">
        <h3 className="font-bold text-lg">
          {item.place?.name}
        </h3>

        <p className="text-sm text-zinc-400 flex items-center gap-2 mt-1">
          <MapPin size={14} />
          {item.place?.address}
        </p>

        <p className="text-sm mt-2">{item.note}</p>
      </div>

      <button
        onClick={() => onDelete(item.id)}
        className="p-4 text-red-500 hover:bg-red-50"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};

export default ActivityCard;