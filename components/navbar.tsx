"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CardanoWallet, useWallet } from "@meshsdk/react";
import { createUser } from "@/app/services/transactionService";
import { deserializeAddress, generateNonce, checkSignature } from "@meshsdk/core";
import { toast } from "react-hot-toast"; // Thêm toast notifications

// Hàm lấy wallet address, sử dụng cùng logic như trong file Unlock
const getWalletAddress = async (wallet: { getChangeAddress: () => Promise<string> }) => {
  const hexAddress = await wallet.getChangeAddress();
  return hexAddress;
};

export default function Navbar() {
  const { connected, wallet } = useWallet();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function registerUser() {
      if (wallet && connected) {
        try {
          const addr = await getWalletAddress(wallet);
          const nonce = generateNonce("Welcome Everyone to my chanel Long dep trai vai o");
          
          // Thêm xử lý lỗi và retry logic cho việc ký
          let signature;
          let result = false;
          let retryCount = 0;
          
          while (!result && retryCount < 3) {
            try {
              signature = await wallet.signData(nonce, addr);
              result = await checkSignature(nonce, signature, addr);
              
              if (!result) {
                retryCount++;
                if (retryCount < 3) {
                  console.warn(`Signature verification failed. Retrying (${retryCount}/3)...`);
                  // Hiển thị thông báo yêu cầu ký lại
                  toast.error("Signature verification failed. Please sign again.");
                  await new Promise(resolve => setTimeout(resolve, 1000)); // Đợi 1 giây trước khi thử lại
                }
              }
            } catch (signError) {
              console.error("Error during signing:", signError);
              retryCount++;
              if (retryCount < 3) {
                toast.error("Failed to sign message. Please try again.");
                await new Promise(resolve => setTimeout(resolve, 1000));
              } else {
                throw signError; // Ném lỗi nếu đã thử quá 3 lần
              }
            }
          }
          
          if (!result) {
            toast.error("Failed to verify your signature after multiple attempts. Please reconnect your wallet.");
            throw new Error("Signature verification failed after multiple attempts");
          }
          
          // Gọi API tạo user nếu ký thành công
          await createUser(addr);
          setIsAuthenticated(true);
          toast.success("Wallet connected and authenticated successfully!");
          
        } catch (error) {
          console.error("Error creating user:", error);
          toast.error("Error connecting wallet: " + (error instanceof Error ? error.message : String(error)));
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    }
    
    registerUser();
  }, [wallet, connected]);

  return (
    <header className="bg-[#4834d4] py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-white"
        >
          <img src="/bhms-logo.svg" alt="BHMS Logo" width={40} height={40} />
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
        <div className="flex items-center gap-2">
          {isAuthenticated && (
            <span className="text-green-400 text-sm">✓ Verified</span>
          )}
          <div className="bg-white/10 border border-white/20 rounded-full px-4 py-2">
            <CardanoWallet />
          </div>
        </div>
      </div>
    </header>
  );
}