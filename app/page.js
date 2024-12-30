import ChartContainer from '@/components/ChartContainer/ChartContainer';
import Clock from '@/components/Clock/Clock';
import CustomerStaffMatching from '@/components/CustomerStaffMatching/CustomerStaffMatching';

export default function Home() {
  return (
    // Consider gathering data such as what kind of music increases spending, associate that data to data for that night.
    // como sabes que paso el dia que mas facturaste, quien era el DJ, cuantas pax,
    <section className="h-full bg-bgGray">
      {/* <Clock /> */}
      <ChartContainer />
      <CustomerStaffMatching />
    </section>
  );
}
