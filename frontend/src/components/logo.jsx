
import { Plane } from 'lucide-react';

const Logo = ({ className = "", iconSize = 26, containerSize = "w-16 h-16" }) => {
  return (
    <div className={` ${className}`}>
      <div className={`inline-flex items-center justify-center ${containerSize} bg-[#041E23] rounded-2xl shadow-lg mb-4`}>
        <Plane size={iconSize} className="text-amber-400 -rotate-12" />
      </div>
    </div>
  );
};

export default Logo;