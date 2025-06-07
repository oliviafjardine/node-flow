import Hero from '../components/shared/Hero';
import About from '../components/sections/AboutSection';
import DataStructures from '../components/sections/DataStructuresSection';
import Algorithms from '../components/sections/AlgorithmsSection';

const Home = () => {
  return (
    <>
      <Hero />
      <section id="about">
        <About isHome />
      </section>
      <section id="DataStructures">
        <DataStructures />
      </section>
      <section id="Algorithms">
        <Algorithms />
      </section>
    </>
  );
};

export default Home;