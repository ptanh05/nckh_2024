import Link from "next/link";
import { Github, Twitter, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1f1e27] py-16 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xl font-bold mb-4">
              <img
                src="/bhms-logo.svg"
                alt="BHMS Logo"
                width={40}
                height={40}
              />
              BHMS
            </div>
            <p className="text-[#a7a9be] mb-4">
              The future of digital legacy management powered by Cardano
              blockchain.
            </p>
            <div className="flex gap-4">
              <Link
                href="#"
                className="bg-white/10 hover:bg-[#4361ee] transition-colors w-10 h-10 rounded-full flex items-center justify-center"
              >
                <Twitter size={18} />
              </Link>
              <Link
                href="#"
                className="bg-white/10 hover:bg-[#4361ee] transition-colors w-10 h-10 rounded-full flex items-center justify-center"
              >
                <MessageCircle size={18} />
              </Link>
              <Link
                href="#"
                className="bg-white/10 hover:bg-[#4361ee] transition-colors w-10 h-10 rounded-full flex items-center justify-center"
              >
                <Github size={18} />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-[#4cc9f0] font-medium mb-4">Platform</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-[#a7a9be] hover:text-[#4cc9f0] transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[#a7a9be] hover:text-[#4cc9f0] transition-colors"
                >
                  NFT Tools
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[#a7a9be] hover:text-[#4cc9f0] transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[#a7a9be] hover:text-[#4cc9f0] transition-colors"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[#4cc9f0] font-medium mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-[#a7a9be] hover:text-[#4cc9f0] transition-colors"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[#a7a9be] hover:text-[#4cc9f0] transition-colors"
                >
                  API
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[#a7a9be] hover:text-[#4cc9f0] transition-colors"
                >
                  Developers
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[#a7a9be] hover:text-[#4cc9f0] transition-colors"
                >
                  Whitepaper
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[#4cc9f0] font-medium mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-[#a7a9be] hover:text-[#4cc9f0] transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[#a7a9be] hover:text-[#4cc9f0] transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[#a7a9be] hover:text-[#4cc9f0] transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[#a7a9be] hover:text-[#4cc9f0] transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-center text-[#a7a9be]">
          <p>
            &copy; 2025 Blockchain Heritage Management System. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
