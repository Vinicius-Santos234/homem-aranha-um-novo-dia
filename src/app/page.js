import ChamadaLugares from "@/components/ChamadaLugares";
import Hero from "@/components/Hero";
import Nav from "@/components/Nav";
import Personagens from "@/components/Personagens";
import Preloader from "@/components/Preloader";
import SecaoVideo from "@/components/SecaoVideo";

export default function Home() {
  return (
    <>
      <Preloader />
      <Nav />
      <main id="topo">
        <Hero />
        <Personagens />
        <ChamadaLugares />
        <SecaoVideo />
      </main>
    </>
  );
}
