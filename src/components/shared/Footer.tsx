import { FaInstagram, FaLinkedinIn, FaGithub } from 'react-icons/fa';


const Footer = () => {
  return (
    <footer className="bg-footer py-6 mt-auto text-gray-700">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <img src="/src/assets/code.png" alt="logo" className='w-8 h-auto mb-2'/>

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 mb-6">
          <div className="lg:col-span-4">
            <h5 className="uppercase font-semibold mb-2">Node Flow</h5>
            <p className="text-sm">
              Understand complex data structures and algorithms with step-by-step visual explanations, interactive examples, and hands-on practice.
            </p>
          </div>

          <div className="lg:col-span-1">
            <h5 className="uppercase font-semibold mb-2">Links</h5>
            <ul className="space-y-2 text-sm">
              <li><a href="#home" className="hover:text-white transition">Home</a></li>
              <li><a href="#about" className="hover:text-white transition">About</a></li>
              <li><a href="#algorithms" className="hover:text-white transition">Algorithms</a></li>
              <li><a href="#DataStructures" className="hover:text-white transition">DataStructures</a></li>
              <li><a href="#contact" className="hover:text-white transition">Contact</a></li>
            </ul>
          </div>

          <div className="lg:col-span-1">
            <h5 className="uppercase font-semibold mb-2">Creator</h5>
            <ul className="space-y-2 text-sm">
              <li>Olivia Jardine</li>
            </ul>
            
            <div className="flex space-x-3 mt-3 text-xl text-gray-600">
            <a
              href="https://github.com/olivia-jardine"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black transition"
            >
              <FaGithub />
            </a>

            <a
              href="https://linkedin.com/in/olivia-jardine"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition"
            >
              <FaLinkedinIn />
            </a>

            <a
              href="https://instagram.com/olivia.jardine"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-500 transition"
            >
              <FaInstagram />
            </a>
          </div>

          </div>
        </div>

        {/* Divider + Copyright */}
        <div className="container mx-auto text-center">
          <hr className="my-6 border-gray-300 sm:mx-auto lg:my-8" />
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Olivia Jardine. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
