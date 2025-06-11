import Hero from '../components/shared/Hero';
import About from '../components/sections/AboutSection';
import DataStructuresHomeSection from '../components/sections/DataStructuresHomeSection';
import AlgorithmsHomeSection from '../components/sections/AlgorithmsHomeSection';

const Home = () => {
  return (
    <>
      <Hero />

      {/* About Section */}
      <section id="about" className="bg-surface-elevated">
        <About isHome />
      </section>

      {/* Explore Topics Section */}
      <section id="explore" className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
            Choose Your Learning Path
          </h2>
          <p className="text-secondary text-lg max-w-2xl mx-auto">
            Start your journey with either data structures or algorithms. Each path includes interactive visualizations and comprehensive explanations.
          </p>
        </div>

        <div className="grid gap-8 lg:gap-12 md:grid-cols-2 max-w-4xl mx-auto">
          <DataStructuresHomeSection />
          <AlgorithmsHomeSection />
        </div>
      </section>
    </>
  );
};

export default Home;