import React from 'react';
import { Brain, Target, Users, Lightbulb, Code, BookOpen, Zap, Eye } from 'lucide-react';

type AboutProps = {
  isHome?: boolean;
};

const About: React.FC<AboutProps> = ({ isHome = false }) => {
  const features = [
    {
      icon: Eye,
      title: "Visual Learning",
      description: "See algorithms and data structures in action with step-by-step animations and interactive demonstrations.",
      color: "accent-blue"
    },
    {
      icon: Brain,
      title: "Conceptual Understanding",
      description: "Build deep understanding through visual patterns and logical connections rather than rote memorization.",
      color: "accent-purple"
    },
    {
      icon: Zap,
      title: "Interactive Practice",
      description: "Hands-on exercises and real-time feedback help reinforce learning and build confidence.",
      color: "accent-green"
    },
    {
      icon: Code,
      title: "Real-world Applications",
      description: "Connect theoretical concepts to practical programming scenarios and industry use cases.",
      color: "brand"
    }
  ];

  const benefits = [
    {
      icon: Target,
      title: "Faster Comprehension",
      description: "Visual representations help you understand complex concepts 3x faster than traditional text-based learning."
    },
    {
      icon: BookOpen,
      title: "Better Retention",
      description: "Interactive visualizations create stronger memory connections, improving long-term retention by up to 65%."
    },
    {
      icon: Users,
      title: "Interview Confidence",
      description: "Deep visual understanding translates to better performance in technical interviews and coding challenges."
    },
    {
      icon: Lightbulb,
      title: "Problem-Solving Skills",
      description: "Learn to recognize patterns and choose the right data structure or algorithm for any given problem."
    }
  ];

  if (isHome) {
    return (
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-6">
            Why Visual Learning Works
          </h2>
          <p className="text-xl text-secondary max-w-4xl mx-auto leading-relaxed">
            Traditional computer science education often relies on abstract concepts and text-heavy explanations.
            We believe there's a better way to learn data structures and algorithms.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center bg-accent-light border border-accent/20">
                <feature.icon className="w-10 h-10 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-4">{feature.title}</h3>
              <p className="text-secondary leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Full About page content
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 space-y-20">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-6">
          About Node Flow
        </h1>
        <p className="text-xl text-secondary max-w-4xl mx-auto leading-relaxed">
          Node Flow is an interactive learning platform designed to make data structures and algorithms
          accessible, engaging, and memorable through the power of visualization.
        </p>
      </div>

      {/* Mission Section */}
      <div className="bg-surface-elevated rounded-2xl p-8 lg:p-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-primary mb-6">Our Mission</h2>
            <div className="space-y-4 text-secondary leading-relaxed">
              <p>
                <strong className="text-primary">Traditional computer science education has a problem.</strong>
                Students often struggle with abstract concepts like algorithms and data structures because
                they're taught through static diagrams and dense textbooks.
              </p>
              <p>
                We believe that <strong className="text-primary">visual, interactive learning</strong> is the key
                to understanding these fundamental concepts. When you can see how a binary search tree balances
                itself or watch a sorting algorithm work step-by-step, the "aha!" moments come naturally.
              </p>
              <p>
                Our mission is to bridge the gap between theory and understanding, making computer science
                fundamentals accessible to learners of all backgrounds and experience levels.
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl p-8">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent-light rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary">Clear Understanding</h3>
                  <p className="text-sm text-secondary">Make complex concepts simple and intuitive</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-success-light rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-success" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary">Engaging Experience</h3>
                  <p className="text-sm text-secondary">Learn through interaction, not memorization</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent-light rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary">Accessible Learning</h3>
                  <p className="text-sm text-secondary">For beginners and experts alike</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Visual Learning Works */}
      <div>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">Why Visual Learning Works</h2>
          <p className="text-lg text-secondary max-w-3xl mx-auto">
            Research shows that visual learning significantly improves comprehension and retention.
            Here's why our approach is so effective:
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-surface rounded-xl p-6 border border-subtle hover:border-accent/20 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent-light rounded-lg flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-2">{benefit.title}</h3>
                  <p className="text-secondary leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* What You'll Learn */}
      <div className="bg-surface rounded-2xl p-8 lg:p-12 border border-subtle">
        <h2 className="text-3xl font-bold text-primary mb-8 text-center">What You'll Learn</h2>

        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-xl font-semibold text-primary mb-4 flex items-center gap-2">
              <div className="w-6 h-6 bg-accent-light rounded flex items-center justify-center">
                <Code className="w-4 h-4 text-accent" />
              </div>
              Data Structures
            </h3>
            <ul className="space-y-3 text-secondary">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                <span>Arrays, Linked Lists, and their real-world applications</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                <span>Stacks and Queues for managing data flow</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                <span>Trees and Graphs for hierarchical and network data</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                <span>Hash Tables for lightning-fast lookups</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                <span>Advanced structures like Heaps and Tries</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-primary mb-4 flex items-center gap-2">
              <div className="w-6 h-6 bg-accent-light rounded flex items-center justify-center">
                <Zap className="w-4 h-4 text-accent" />
              </div>
              Algorithms
            </h3>
            <ul className="space-y-3 text-secondary">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                <span>Sorting algorithms from Bubble Sort to Quick Sort</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                <span>Search algorithms including Binary Search</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                <span>Dynamic Programming for optimization problems</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                <span>Graph algorithms like DFS, BFS, and Dijkstra</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                <span>Greedy algorithms and divide-and-conquer strategies</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center bg-gradient-to-r from-accent/5 to-accent/10 rounded-2xl p-8 lg:p-12">
        <h2 className="text-3xl font-bold text-primary mb-4">Ready to Start Learning?</h2>
        <p className="text-lg text-secondary mb-8 max-w-2xl mx-auto">
          Join thousands of students who have transformed their understanding of computer science fundamentals
          through visual, interactive learning.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/data-structures"
            className="inline-flex items-center justify-center px-8 py-3 bg-accent text-inverse rounded-lg font-semibold hover:bg-accent-hover transition-colors"
          >
            Explore Data Structures
          </a>
          <a
            href="/algorithms"
            className="inline-flex items-center justify-center px-8 py-3 border border-accent text-accent rounded-lg font-semibold hover:bg-accent-light transition-colors"
          >
            Discover Algorithms
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
