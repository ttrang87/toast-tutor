import { useState } from "react";
import { Search } from "lucide-react";

const GIPHY_API_KEY = "mQhTiyGo9q17xt7hVtccVeW9Jzr7I3PN";

export default function StickerPicker({ onSelect }) {
  const [query, setQuery] = useState("");
  const [stickers, setStickers] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchStickers = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.giphy.com/v1/stickers/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(query)}&limit=20`
      );
      const json = await res.json();
      setStickers(json.data);
    } catch (err) {
      console.error("Failed to fetch stickers", err);
    }
    setLoading(false);
  };

  return (
    <div className="absolute w-1/4 bottom-3 bg-white rounded-xl p-4 shadow-md">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search stickers"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchStickers()}
          style={{ fontSize: "13px" }}
          className="border rounded-xl w-full p-2 border-2 border-orange-300"
        />
        <button onClick={searchStickers} className="bg-orange-100 p-2 rounded-full text-xl">
          🕵️‍♂️
        </button>
      </div>
      <div
        style={{
          marginTop: 20,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(60px, 1fr))",
          maxHeight: 300,            // Limit the height (adjust as needed)
          overflowY: "auto",         // Enable scroll
          paddingRight: 4,           // Optional: space for scrollbar
          gap: 10,
        }}
      >
        {stickers.map((sticker) => (
          <img
            key={sticker.id}
            src={sticker.images.fixed_height.url}
            alt={sticker.title}
            style={{ width: "100%", cursor: "pointer", borderRadius: 8 }}
            onClick={() => {
              if (onSelect) onSelect(sticker);
              else alert(`Selected sticker URL:\n${sticker.images.fixed_height.url}`);
            }}
          />
        ))}
      </div>
    </div>
  );
}
