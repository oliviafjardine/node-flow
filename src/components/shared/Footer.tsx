import { FaInstagram, FaLinkedinIn, FaGithub } from 'react-icons/fa';
import { Database } from 'lucide-react';


const Footer = () => {
  return (
    <footer className="bg-surface border-t border-subtle py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-inverse" />
              </div>
              <h5 className="text-lg font-bold text-primary">Node Flow</h5>
            </div>
            <p className="text-secondary leading-relaxed mb-4">
              Master data structures and algorithms through interactive visualizations, step-by-step explanations, and hands-on practice.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h6 className="font-semibold text-primary mb-3">Quick Links</h6>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-secondary hover:text-brand transition-colors">Home</a></li>
              <li><a href="/data-structures" className="text-secondary hover:text-brand transition-colors">Data Structures</a></li>
              <li><a href="/algorithms" className="text-secondary hover:text-brand transition-colors">Algorithms</a></li>
              <li><a href="/about" className="text-secondary hover:text-brand transition-colors">About</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h6 className="font-semibold text-primary mb-3">Connect</h6>
            <p className="text-sm text-secondary mb-3">Created by Olivia Jardine</p>

            <div className="flex space-x-3">
              <a
                href="https://github.com/olivia-jardine"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-surface-elevated rounded-lg flex items-center justify-center text-secondary hover:text-primary hover:bg-brand-light transition-all duration-200"
              >
                <FaGithub className="w-4 h-4" />
              </a>

              <a
                href="https://linkedin.com/in/olivia-jardine"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-surface-elevated rounded-lg flex items-center justify-center text-secondary hover:text-primary hover:bg-brand-light transition-all duration-200"
              >
                <FaLinkedinIn className="w-4 h-4" />
              </a>

              <a
                href="https://instagram.com/olivia.jardine"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-surface-elevated rounded-lg flex items-center justify-center text-secondary hover:text-primary hover:bg-brand-light transition-all duration-200"
              >
                <FaInstagram className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-subtle text-center">
          <p className="text-sm text-tertiary">
            © {new Date().getFullYear()} Node Flow. Built with ❤️ for learning.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
