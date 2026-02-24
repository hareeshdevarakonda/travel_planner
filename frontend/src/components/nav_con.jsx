import { PanelLeft } from 'lucide-react';

const SidebarIcon = () => {
  return (
    <div className="flex justify">
 <button className="bg-amber-400 hover:bg-amber-500 text-[#041E23] p-2 rounded-lg transition hover:rotate-180 duration-300">

    <PanelLeft size={24} className="text-gray-700" />
  </button>
</div>

  );
};
export default SidebarIcon