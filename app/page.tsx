import type React from "react";
import Image from "next/image";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import {
  Shield,
  FileText,
  UserCheck,
  RotateCcw,
  Lock,
  Key,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main>
      

      {/* Hero Section */}
      <section className="min-h-screen flex items-center relative pt-16">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold gradient-text">
                Secure Your Digital Legacy
              </h1>
              <p className="text-lg text-[#a7a9be] max-w-xl">
                Blockchain Heritage Management System helps you preserve and
                transfer your digital assets securely using Cardano blockchain
                technology.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="gradient-bg text-white rounded-full px-8 py-6 hover:opacity-90 hover:-translate-y-1 transition-all">
                  Get Started
                </Button>
                <Button
                  variant="outline"
                  className="border-[#4cc9f0] text-[#4cc9f0] rounded-full px-8 py-6 hover:bg-[#4cc9f0]/10 hover:-translate-y-1 transition-all"
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/path-to-your-image.jpg" // Replace with the actual image path
                alt="Blockchain Heritage Illustration"
                width={600}
                height={600}
                className="w-full max-w-lg mx-auto animate-float"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 400 400"
                className="absolute top-0 left-0"
              >
                <circle
                  cx="200"
                  cy="200"
                  r="150"
                  fill="url(#blueGradient)"
                  opacity="0.1"
                />

                <defs>
                  <linearGradient
                    id="blueGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#4070FF" />
                    <stop offset="100%" stopColor="#8C52FF" />
                  </linearGradient>
                </defs>

                <path
                  d="M200,70 L270,105 L270,175 L200,210 L130,175 L130,105 Z"
                  fill="none"
                  stroke="url(#blueGradient)"
                  strokeWidth="3"
                  opacity="0.8"
                />

                <path
                  d="M200,100 L245,123 L245,168 L200,190 L155,168 L155,123 Z"
                  fill="none"
                  stroke="url(#blueGradient)"
                  strokeWidth="2.5"
                  opacity="0.9"
                />

                <path
                  d="M200,130 L225,143 L225,168 L200,180 L175,168 L175,143 Z"
                  fill="url(#blueGradient)"
                  opacity="0.7"
                />

                <line
                  x1="200"
                  y1="70"
                  x2="200"
                  y2="40"
                  stroke="url(#blueGradient)"
                  strokeWidth="2"
                  opacity="0.6"
                />
                <line
                  x1="270"
                  y1="105"
                  x2="300"
                  y2="90"
                  stroke="url(#blueGradient)"
                  strokeWidth="2"
                  opacity="0.6"
                />
                <line
                  x1="270"
                  y1="175"
                  x2="300"
                  y2="190"
                  stroke="url(#blueGradient)"
                  strokeWidth="2"
                  opacity="0.6"
                />
                <line
                  x1="200"
                  y1="210"
                  x2="200"
                  y2="240"
                  stroke="url(#blueGradient)"
                  strokeWidth="2"
                  opacity="0.6"
                />
                <line
                  x1="130"
                  y1="175"
                  x2="100"
                  y2="190"
                  stroke="url(#blueGradient)"
                  strokeWidth="2"
                  opacity="0.6"
                />
                <line
                  x1="130"
                  y1="105"
                  x2="100"
                  y2="90"
                  stroke="url(#blueGradient)"
                  strokeWidth="2"
                  opacity="0.6"
                />

                <circle
                  cx="200"
                  cy="40"
                  r="10"
                  fill="url(#blueGradient)"
                  opacity="0.8"
                />
                <circle
                  cx="300"
                  cy="90"
                  r="10"
                  fill="url(#blueGradient)"
                  opacity="0.8"
                />
                <circle
                  cx="300"
                  cy="190"
                  r="10"
                  fill="url(#blueGradient)"
                  opacity="0.8"
                />
                <circle
                  cx="200"
                  cy="240"
                  r="10"
                  fill="url(#blueGradient)"
                  opacity="0.8"
                />
                <circle
                  cx="100"
                  cy="190"
                  r="10"
                  fill="url(#blueGradient)"
                  opacity="0.8"
                />
                <circle
                  cx="100"
                  cy="90"
                  r="10"
                  fill="url(#blueGradient)"
                  opacity="0.8"
                />

                <line
                  x1="200"
                  y1="40"
                  x2="300"
                  y2="90"
                  stroke="url(#blueGradient)"
                  strokeWidth="1.5"
                  opacity="0.5"
                />
                <line
                  x1="300"
                  y1="90"
                  x2="300"
                  y2="190"
                  stroke="url(#blueGradient)"
                  strokeWidth="1.5"
                  opacity="0.5"
                />
                <line
                  x1="300"
                  y1="190"
                  x2="200"
                  y2="240"
                  stroke="url(#blueGradient)"
                  strokeWidth="1.5"
                  opacity="0.5"
                />
                <line
                  x1="200"
                  y1="240"
                  x2="100"
                  y2="190"
                  stroke="url(#blueGradient)"
                  strokeWidth="1.5"
                  opacity="0.5"
                />
                <line
                  x1="100"
                  y1="190"
                  x2="100"
                  y2="90"
                  stroke="url(#blueGradient)"
                  strokeWidth="1.5"
                  opacity="0.5"
                />
                <line
                  x1="100"
                  y1="90"
                  x2="200"
                  y2="40"
                  stroke="url(#blueGradient)"
                  strokeWidth="1.5"
                  opacity="0.5"
                />

                <text
                  x="200"
                  y="340"
                  fontFamily="Arial"
                  fontSize="16"
                  fontWeight="bold"
                  textAnchor="middle"
                  fill="url(#blueGradient)"
                >
                  DIGITAL LEGACY
                </text>

                <circle cx="220" cy="90" r="2" fill="#ffffff" opacity="0.7" />
                <circle cx="170" cy="220" r="2" fill="#ffffff" opacity="0.7" />
                <circle cx="260" cy="150" r="2" fill="#ffffff" opacity="0.7" />
                <circle cx="140" cy="140" r="2" fill="#ffffff" opacity="0.7" />
                <circle cx="230" cy="200" r="2" fill="#ffffff" opacity="0.7" />
                <circle cx="180" cy="110" r="2" fill="#ffffff" opacity="0.7" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-[#1f1e27]" id="features">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
              Core Features
            </h2>
            <p className="text-[#a7a9be] max-w-2xl mx-auto">
              Preserve your digital legacy with advanced blockchain technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Shield className="w-12 h-12" />}
              title="Secure Asset Storage"
              description="Store your digital assets and instructions securely on the Cardano blockchain with immutable records."
            />
            <FeatureCard
              icon={<FileText className="w-12 h-12" />}
              title="Smart Contracts"
              description="Automate the execution of your instructions and asset distribution with Plutus smart contracts."
            />
            <FeatureCard
              icon={<UserCheck className="w-12 h-12" />}
              title="Beneficiary Management"
              description="Securely manage who receives your assets and when, with digital signature verification."
            />
            <FeatureCard
              icon={<RotateCcw className="w-12 h-12" />}
              title="Refund Capability"
              description="Maintain control with the ability to request refunds before assets are transferred to beneficiaries."
            />
            <FeatureCard
              icon={<Lock className="w-12 h-12" />}
              title="Time-Lock System"
              description="Set specific time periods for asset locks before they become available to beneficiaries."
            />
            <FeatureCard
              icon={<Key className="w-12 h-12" />}
              title="Privacy Protection"
              description="AES-256 encryption ensures your sensitive information remains private and secure."
            />
          </div>
        </div>
      </section>

      {/* NFT Features Section */}
      <section className="py-16 md:py-24" id="nft">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
              NFT Management
            </h2>
            <p className="text-[#a7a9be] max-w-2xl mx-auto">
              Advanced tools for your digital collectibles
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#ff9e00] to-[#ff0069] bg-clip-text text-transparent">
                Complete NFT Lifecycle Management
              </h3>
              <ul className="space-y-4">
                {[
                  "Mint CIP68 NFTs with enhanced metadata standards",
                  "Update your NFT metadata securely and efficiently",
                  "Burn NFTs when they're no longer needed",
                  "Transfer NFTs to beneficiaries based on smart contract conditions",
                  "Set royalty and resale conditions for your digital creations",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-[#4cc9f0] font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button className="gradient-bg text-white rounded-full px-8 py-6 hover:opacity-90 hover:-translate-y-1 transition-all">
                Explore NFT Tools
              </Button>
            </div>
            <div className="rounded-xl overflow-hidden shadow-2xl border border-white/10">
              <Image
                src="/placeholder.svg?height=500&width=500"
                alt="NFT Management Interface"
                width={500}
                height={500}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-[#1f1e27]" id="how-it-works">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
              How It Works
            </h2>
            <p className="text-[#a7a9be] max-w-2xl mx-auto">
              Simple steps to secure your digital legacy
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {[
              {
                number: 1,
                title: "Connect Your Wallet",
                description:
                  "Connect your Cardano wallet to access the BHMS platform and start managing your digital assets.",
              },
              {
                number: 2,
                title: "Create Your Legacy Plan",
                description:
                  "Upload your assets, write instructions, and specify beneficiaries who will receive your digital legacy.",
              },
              {
                number: 3,
                title: "Set Time-Lock Conditions",
                description:
                  "Define when your assets will be available to beneficiaries and set up any additional conditions.",
              },
              {
                number: 4,
                title: "Mint or Update NFTs",
                description:
                  "Create CIP68-compliant NFTs to represent your assets or update existing ones with new metadata.",
              },
              {
                number: 5,
                title: "Monitor and Manage",
                description:
                  "Keep track of your assets, make updates, or request refunds if circumstances change.",
              },
            ].map((step, index) => (
              <div key={index} className="flex gap-6 mb-12 relative">
                <div className="gradient-bg w-12 h-12 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  {step.number}
                </div>
                {index < 4 && (
                  <div className="absolute left-6 top-12 w-[2px] h-[calc(100%-12px)] bg-gradient-to-b from-[#4834d4] to-[#4cc9f0]"></div>
                )}
                <div className="bg-[#0f0e17] rounded-xl p-6 border border-white/5 flex-grow">
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-[#a7a9be]">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-16 md:py-24" id="dashboard">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
              Dashboard Preview
            </h2>
            <p className="text-[#a7a9be] max-w-2xl mx-auto">
              Take control of your digital legacy with our intuitive interface
            </p>
          </div>

          <div className="rounded-xl overflow-hidden shadow-2xl border border-white/10">
            <Image
              src="/placeholder.svg?height=600&width=1200"
              alt="BHMS Dashboard Interface"
              width={1200}
              height={600}
              className="w-full"
            />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-24 gradient-bg">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Secure Your Digital Legacy?
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            Join thousands of users who trust BHMS to protect and manage their
            digital assets for future generations.
          </p>
          <Button className="bg-white text-[#4834d4] hover:bg-white/90 rounded-full px-8 py-6 text-lg font-medium">
            Get Started Today
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-[#0f0e17]/70 border border-white/5 rounded-2xl p-8 transition-all hover:-translate-y-2 hover:shadow-xl hover:shadow-[#4834d4]/10 flex flex-col items-center text-center">
      <div className="gradient-text mb-6">{icon}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-[#a7a9be]">{description}</p>
    </div>
  );
}
