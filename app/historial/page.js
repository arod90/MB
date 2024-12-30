'use client';

import ReportsDashboard from '@/components/ReportsDashboard/ReportsDashboard';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

export default function HistorialPage() {
  return (
    <section className="h-screen bg-bgGray flex flex-col">
      {/* 
        Give the entire screen height and use flex so 
        we can split the page into a top area (date selection)
        and a bottom area (the charts grid). 
      */}
      <ReportsDashboard />
    </section>
  );
}
