import { useState } from 'react';

type Tab = {
  label: string;
  content: React.ReactNode;
};

interface AppointmentTabbarProps {
    appointmentstabs: Tab[];
}

const AppointmentTabbar: React.FC<AppointmentTabbarProps> = ({ appointmentstabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <div className="flex">
        {appointmentstabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`${
              index === activeTab
                ? 'text-gray-900 border-b-2 font-bold border-purple-600'
                : 'text-gray-700'
            } py-2 px-4 text-xs md:text-base focus:outline-none`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-4 border border-t-0 rounded-b">
        {appointmentstabs[activeTab].content}
      </div>
    </div>
  );
};

export default AppointmentTabbar;
