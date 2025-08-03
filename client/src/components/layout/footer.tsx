import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Youtube, Shield, ShieldQuestion, Award } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="text-2xl font-bold text-turquoise mb-4">GetABonus.net</div>
            <p className="text-gray-400 mb-6">
              Your trusted source for casino bonuses, reviews, and expert gambling guidance since 2024. 
              We help players make informed decisions and find the best casino experiences.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-turquoise transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-turquoise transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-turquoise transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-turquoise transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/casinos">
                  <span className="text-gray-400 hover:text-turquoise transition-colors cursor-pointer">Top Casinos</span>
                </Link>
              </li>
              <li>
                <Link href="/bonuses">
                  <span className="text-gray-400 hover:text-turquoise transition-colors cursor-pointer">Best Bonuses</span>
                </Link>
              </li>
              <li>
                <Link href="/reviews">
                  <span className="text-gray-400 hover:text-turquoise transition-colors cursor-pointer">Casino Reviews</span>
                </Link>
              </li>
              <li>
                <Link href="/casinos?filter=crypto">
                  <span className="text-gray-400 hover:text-turquoise transition-colors cursor-pointer">Crypto Casinos</span>
                </Link>
              </li>
              <li>
                <Link href="/casinos?filter=mobile">
                  <span className="text-gray-400 hover:text-turquoise transition-colors cursor-pointer">Mobile Casinos</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="mailto:info@getabonus.net" className="text-gray-400 hover:text-turquoise transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-turquoise transition-colors">FAQ</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-turquoise transition-colors">Responsible Gambling</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-turquoise transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-turquoise transition-colors">Privacy Policy</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-400" />
                <span className="text-sm text-gray-400">SSL Secured</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldQuestion className="h-5 w-5 text-blue-400" />
                <span className="text-sm text-gray-400">Privacy Protected</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-yellow-400" />
                <span className="text-sm text-gray-400">Trusted Reviews</span>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              © 2025 GetABonus.net. All rights reserved. | 
              <strong className="text-orange ml-1">21+. Please gamble responsibly.</strong>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
