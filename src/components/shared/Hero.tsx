import { ArrowRight, Play, BookOpen, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  const stats = [
    { label: "Data Structures", value: "11", icon: BookOpen },
    { label: "Algorithms", value: "11", icon: TrendingUp },
    { label: "Interactive Demos", value: "22+", icon: Play },
  ];

  return (
    <section className="relative bg-gradient-to-br from-surface via-surface-elevated to-accent-light py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Content */}
          <div className="space-y-10">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-accent-light border border-accent/20 rounded-full text-accent font-medium">
                <Play className="w-5 h-5" />
                Interactive Learning Platform
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-primary leading-tight">
                Master Data Structures & Algorithms
                <span className="block text-accent mt-2">
                  Through Visualization
                </span>
              </h1>

              <p className="text-xl text-secondary leading-relaxed max-w-2xl">
                Build a solid foundation in computer science fundamentals with interactive visualizations,
                step-by-step explanations, and hands-on practice.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6">
              <Link
                to="/data-structures"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-accent text-inverse rounded font-semibold"
              >
                Start Learning
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                to="/about"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 border-2 border-accent text-accent rounded font-semibold"
              >
                Learn More
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-10 border-t border-subtle">
              {stats.map(({ label, value, icon: Icon }) => (
                <div key={label} className="text-center">
                  <div className="flex items-center justify-center w-14 h-14 bg-accent-light rounded-xl mx-auto mb-4">
                    <Icon className="w-7 h-7 text-accent" />
                  </div>
                  <div className="text-2xl font-bold text-primary">{value}</div>
                  <div className="text-sm text-muted">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Element */}
          <div className="relative">
            <div className="relative bg-surface rounded-2xl shadow-custom-xl p-8 border border-subtle">
              {/* Mock Code Editor */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-4 border-b border-subtle">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-muted ml-2">algorithm.js</span>
                </div>

                <div className="space-y-2 font-mono text-sm">
                  <div className="text-muted">// Binary Search Implementation</div>
                  <div className="text-primary">
                    <span className="text-accent">function</span> binarySearch(arr, target) {'{'}
                  </div>
                  <div className="text-primary ml-4">
                    <span className="text-accent">let</span> left = <span className="text-success">0</span>;
                  </div>
                  <div className="text-primary ml-4">
                    <span className="text-accent">let</span> right = arr.length - <span className="text-success">1</span>;
                  </div>
                  <div className="text-primary ml-4">
                    <span className="text-accent">while</span> (left {'<='} right) {'{'}
                  </div>
                  <div className="text-primary ml-8">
                    <span className="text-accent">const</span> mid = Math.floor((left + right) / <span className="text-success">2</span>);
                  </div>
                  <div className="text-primary ml-8">
                    <span className="text-accent">if</span> (arr[mid] === target) <span className="text-accent">return</span> mid;
                  </div>
                  <div className="text-muted ml-8">// ... complexity: O(log n)</div>
                  <div className="text-primary ml-4">{'}'}</div>
                  <div className="text-primary">{'}'}</div>
                </div>
              </div>

              {/* Floating complexity badge */}
              <div className="absolute -top-4 -right-4 bg-success text-inverse px-4 py-2 rounded-lg text-sm font-semibold shadow-custom-md">
                O(log n)
              </div>
            </div>

            {/* Background decoration */}
            <div className="absolute -inset-4 bg-gradient-to-r from-accent/10 to-accent/5 rounded-3xl -z-10 blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
