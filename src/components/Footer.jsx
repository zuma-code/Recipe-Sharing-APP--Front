import { FaGithub, FaTwitter, FaInstagram } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer p-6 bg-base-300 text-base-content">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        {/* App Name & Copyright */}
        <div className="text-center md:text-left">
          <h2 className="text-lg font-bold">Recipe Sharing App</h2>
          <p className="text-sm">© {new Date().getFullYear()} All Rights Reserved</p>
        </div>

        {/* Social Media Links */}
        <div className="flex gap-4 mt-4 md:mt-0">
          <a href="https://github.com/zuma-code" target="_blank" rel="noopener noreferrer" className="text-lg hover:text-primary">
            <FaGithub />
          </a>
          <a href="https://twitter.com/yourtwitter" target="_blank" rel="noopener noreferrer" className="text-lg hover:text-primary">
            <FaTwitter />
          </a>
          <a href="https://instagram.com/yourinstagram" target="_blank" rel="noopener noreferrer" className="text-lg hover:text-primary">
            <FaInstagram />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
