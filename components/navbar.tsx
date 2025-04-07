"use client"

import Link from "next/link"
import Image from "next/image"
import { Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  return (
    <header className="bg-[#4834d4] py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white">
          <Image src="/placeholder.svg?height=40&width=40" alt="BHMS Logo" width={40} height={40} />
          BHMS
        </Link>
        <nav className="hidden md:flex gap-8">
          <Link href="/" className="text-white hover:text-[#4cc9f0] transition-colors">
            Home
          </Link>
          <Link href="/mint-nft" className="text-white hover:text-[#4cc9f0] transition-colors">
            Mint NFT
          </Link>
          <Link href="/update-nft" className="text-white hover:text-[#4cc9f0] transition-colors">
            Update NFT
          </Link>
          <Link href="/burn-nft" className="text-white hover:text-[#4cc9f0] transition-colors">
            Burn NFT
          </Link>
          <Link href="/lock-assets" className="text-white hover:text-[#4cc9f0] transition-colors">
            Lock Assets
          </Link>
          <Link href="/unlock" className="text-white hover:text-[#4cc9f0] transition-colors">
            Unlock
          </Link>
        </nav>
        <Button
          variant="outline"
          className="bg-white/10 border border-white/20 text-white rounded-full px-4 py-2 flex items-center gap-2"
          onClick={() => alert("Wallet connection feature will be implemented here!")}
        >
          <Wallet size={16} />
          Connect Wallet
        </Button>
      </div>
    </header>
  )
}

