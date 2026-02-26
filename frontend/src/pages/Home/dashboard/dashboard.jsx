import React from "react";
import { ArrowRight, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Popular Indian Tourist Places
const POPULAR_PLACES = [
  {
    id: 1,
    name: "Taj Mahal",
    city: "Agra",
    description: "The stunning white marble mausoleum is one of the most iconic symbols of India and a UNESCO World Heritage Site.",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&h=300&fit=crop"
  },
  {
    id: 2,
    name: "Jaipur City Palace",
    city: "Jaipur",
    description: "A magnificent blend of Rajasthani and Mughal architecture in the heart of the Pink City.",
    image: "https://images.pexels.com/photos/27970035/pexels-photo-27970035.jpeg?cs=srgb&dl=pexels-exploredestination2-27970035.jpg&fm=jpg"
  },
  {
    id: 3,
    name: "Charminar",
    city: "Hyderabad",
    description: "An iconic monument and mosque standing at the heart of Hyderabad, representing a blend of Islamic and Hindu architectural styles.",
    image: "https://media.istockphoto.com/id/1215274990/photo/high-wide-angle-view-of-charminar-in-the-night.jpg?s=612x612&w=0&k=20&c=byyIjqgbslf-L191n6SJu0s35fvNoVeWsxV5rIPK7Sk="
  },
  {
    id: 4,
    name: "Gateway of India",
    city: "Mumbai",
    description: "An iconic arch monument overlooking the Arabian Sea, serving as a gateway to the city and a symbol of Mumbai's maritime heritage.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLGb2gNdtgKCdqU2qQxLaf8Sy92K2f1tiVSA&s"
  },
  {
    id: 5,
    name: "Mysore Palace",
    city: "Mysore",
    description: "A grand Indo-Saracenic palace illuminated with thousands of lights and a symbol of royal Mysore.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQugPP6Cx6daOdbMlQ3zsHWlVFblVk5MS0ow&s"
  },
  {
    id: 6,
    name: "Varanasi Ghats",
    city: "Varanasi",
    description: "Sacred riverbanks along the Ganges offering spiritual experiences and breathtaking sunrises for pilgrims and travelers.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBiZnFY8CJlP1Xykm1wYSWJFfJtgY7_P-NzQ&s"
  }
];

const QUOTES = [
  {
    text: "Travel is the only thing you buy that makes you richer.",
    author: "Unknown"
  },
  {
    text: "To travel is to live.",
    author: "Hans Christian Andersen"
  },
  {
    text: "Adventure is worthwhile in itself.",
    author: "Amelia Earhart"
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];

  return (
    <div className="min-h-screen bg-white animate-in fade-in duration-500">
      
      {/* HERO SECTION WITH INSPIRATIONAL QUOTE */}
      <div className="bg-white px-10 py-16 text-center relative overflow-hidden border-b border-gray-100">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#FFD700] rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>
        
        <div className="relative z-10">
          <p className="text-sm font-black uppercase tracking-[0.5em] text-[#FFD700] mb-4">Explore India's Wonders</p>
          <h1 className="text-6xl font-black text-black mb-6 leading-tight">
            Journey Through <br /> Incredible Destinations
          </h1>
          <p className="text-xl text-black font-bold max-w-2xl mx-auto mb-2">"{randomQuote.text}"</p>
          <p className="text-sm text-black/70 font-semibold">— {randomQuote.author}</p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="px-10 py-12">
        
        {/* POPULAR DESTINATIONS */}
        <div className="mb-16">
          <div className="mb-8">
            <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.5em] mb-3">Featured Destinations</p>
            <h2 className="text-4xl font-black tracking-tight text-black">Popular Indian Tourist Destinations</h2>
            <p className="text-zinc-500 mt-2 text-sm font-semibold max-w-xl">Discover the most iconic and breathtaking places across India that define our rich heritage and culture.</p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {POPULAR_PLACES.map((place) => (
              <div
                key={place.id}
                className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all transform hover:scale-105"
              >
                <div className="relative h-48 overflow-hidden bg-gray-200">
                  <img
                    src={place.image}
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/500x300?text=${place.name}`;
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                </div>
                <div className="p-4">
                  <h4 className="font-black text-lg text-black">{place.name}</h4>
                  <p className="text-sm text-[#FFD700] font-bold mb-2">{place.city}</p>
                  <p className="text-xs text-zinc-600 line-clamp-2">{place.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>



        {/* INSPIRATIONAL MESSAGES */}
        <div className="grid grid-cols-3 gap-6 mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl border border-blue-200">
            <h3 className="text-2xl font-black text-blue-900 mb-3">🌍 Explore</h3>
            <p className="text-blue-800 font-semibold text-sm">Discover breathtaking landscapes and iconic monuments that tell the story of India's rich heritage.</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl border border-green-200">
            <h3 className="text-2xl font-black text-green-900 mb-3">🎯 Plan</h3>
            <p className="text-green-800 font-semibold text-sm">Create personalized itineraries tailored to your interests and make every moment count.</p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-8 rounded-2xl border border-amber-200">
            <h3 className="text-2xl font-black text-amber-900 mb-3">✨ Experience</h3>
            <p className="text-amber-800 font-semibold text-sm">Live unforgettable moments and create memories that will last a lifetime.</p>
          </div>
        </div>

        {/* CALL TO ACTION - BUILD YOUR JOURNEY */}
        <div className="bg-gradient-to-r from-black to-zinc-800 rounded-3xl p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFD700] rounded-full mix-blend-multiply filter blur-3xl"></div>
          </div>
          
          <div className="relative z-10">
            <p className="text-[#FFD700] text-[10px] font-black uppercase tracking-[0.5em] mb-4">Ready to Explore?</p>
            <h2 className="text-5xl font-black text-white mb-6 leading-tight">Start Planning Your Adventure Today</h2>
            <p className="text-white/80 text-lg font-semibold max-w-2xl mx-auto mb-8">Choose from our curated destinations or create your own personalized itinerary and embark on the journey of a lifetime.</p>
            
            <button
              onClick={() => navigate('/home/myjourneys')}
              className="px-10 py-4 bg-[#FFD700] text-black font-black uppercase tracking-widest rounded-2xl hover:bg-white transition-all flex items-center gap-3 mx-auto text-lg shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              <span>View My Itineraries</span>
              <ArrowRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
//   return (
//     <div className="p-12 animate-in fade-in duration-500">
//       <div className="mb-14">
//         <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.5em] mb-4">Your Personal Odyssey</p>
//         <h1 className="text-7xl font-black tracking-tighter text-black leading-tight">
//           Welcome Back,<br />
//           <span className="text-transparent bg-clip-text bg-gradient-to-r from-black via-zinc-600 to-zinc-400">Explorer</span>
//         </h1>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
//         <TripCard
//           image="https://images.unsplash.com/photo-1506905372217-51e926cae444?auto=format&fit=crop&q=80&w=2070"
//           title="Swiss Alps Expedition"
//           date="March 12 - 18, 2026"
//           status="Confirmed"
//         />
//         <TripCard
//           image="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=2070"
//           title="Lake Como Retreat"
//           date="April 05 - 12, 2026"
//           status="In Progress"
//         />

//         {/* Add New Journey Placeholder */}
//         <div className="group border-2 border-dashed border-zinc-200 rounded-[3rem] bg-white flex flex-col items-center justify-center p-12 hover:border-black hover:bg-zinc-50 transition-all cursor-pointer min-h-[450px] shadow-sm">
//           <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-500 shadow-xl shadow-zinc-200">
//             <Plus className="text-[#FFD700]" size={32} />
//           </div>
//           <h3 className="text-xl font-bold text-black mb-2 uppercase tracking-tighter">New Journey</h3>
//           <p className="text-zinc-400 text-xs font-medium uppercase tracking-widest text-center">Plan your next escape</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// const TripCard = ({ image, title, date, status }) => (
//   <div className="group relative bg-white border border-zinc-100 rounded-[3rem] overflow-hidden hover:border-zinc-300 transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-2">
//     <div className="h-64 relative overflow-hidden">
//       <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000" />
//       <div className="absolute top-8 right-8">
//         <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md border border-white/20 shadow-lg ${
//           status === "Confirmed" ? "bg-emerald-500 text-white" : "bg-[#FFD700] text-black"
//         }`}>
//           {status}
//         </span>
//       </div>
//     </div>
//     <div className="p-10">
//       <h3 className="text-3xl font-black text-black mb-2 tracking-tighter group-hover:text-[#FFD700] transition-colors">{title}</h3>
//       <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-10">{date}</p>
//       <button className="w-full py-4 rounded-2xl bg-black text-white font-black text-xs uppercase tracking-[0.3em] hover:bg-[#FFD700] hover:text-black transition-all flex items-center justify-center gap-3 shadow-lg shadow-zinc-200">
//         View Itinerary <ChevronRight size={18} />
//       </button>
//     </div>
//   </div>
// );

// export default Dashboard;