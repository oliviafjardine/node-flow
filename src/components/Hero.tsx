import { ChevronDown } from "lucide-react";

const Hero = () => {
  const scrollToNext = () => {
    const nextSection = document.getElementById("DataStructures");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen py-24 flex items-center justify-center text-center">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Learn Data Structures & Algorithms{" "}
          <span className="text-blue-600">Through Visualization</span>
        </h1>
        <p className="mx-auto s:mx-4 md:mx-20 text-lg text-gray-600">
          Understand complex data structures and algorithms with step-by-step visual explanations, interactive examples, and hands-on practice.
        </p>
      </div>

      {/* Scroll Button */}
      <button
        onClick={scrollToNext}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition"
        aria-label="Scroll to next section"
      >
        <ChevronDown className="w-6 h-6" />
      </button>
    </section>
  );
};

export default Hero;
