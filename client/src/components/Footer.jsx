import { Link } from "react-router-dom";
import { HiOutlineMail } from "react-icons/hi";

const Footer = () => {
  return (
    <footer className="bg-dark-900 text-dark-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 hero-gradient rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SV</span>
              </div>
              <span className="text-xl font-bold text-white">
                Shop<span className="text-primary-400">Verse</span>
              </span>
            </Link>
            <p className="text-dark-400 text-sm leading-relaxed max-w-sm">
              Your premium online shopping destination. Discover quality
              products across electronics, fashion, home & lifestyle at
              unbeatable prices.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/products" className="hover:text-primary-400 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-primary-400 transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-primary-400 transition-colors">
                  My Orders
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-primary-400 transition-colors">
                  Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <HiOutlineMail className="w-4 h-4" />
                <span>support@shopverse.com</span>
              </li>
              <li>Junagarh, Kalahandi</li>
              <li>+91 9876543210</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-700 mt-10 pt-6 text-center text-sm text-dark-500">
          <p>&copy; {new Date().getFullYear()} ShopVerse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
