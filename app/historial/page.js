'use client';

import ReportsDashboard from '../../components/ReportsDashboard/ReportsDashboard';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

export default function HistorialPage() {
  return (
    <section className="h-full overflow-auto">
      <ReportsDashboard />
    </section>
  );
}
