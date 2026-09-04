import { Hero } from "@/components/home/Hero";
import { QuickAvailability } from "@/components/home/QuickAvailability";
import { SelectedWork } from "@/components/home/SelectedWork";
import { Services } from "@/components/home/Services";
import { Team } from "@/components/home/Team";

export default function Home() {
  return (
    <>
      <Hero />
      <QuickAvailability />
      <SelectedWork />
      <Services />
      <Team />
    </>
  );
}
