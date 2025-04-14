"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useWallet } from "@meshsdk/react";
import { burnTokens } from "@/service/nftcip68/burn";
import {
  createUser,
  getUserByWalletAddress,
  createTransaction,
  getUserTransactions,
  updateTransactionStatus,
} from "@/app/services/transactionService";

export default function BurnNFT() {
  const { connected, wallet } = useWallet();
  const [nftName, setNftName] = useState("");
  const [collection, setCollection] = useState("");
  const [reason, setReason] = useState("outdated");
  const [confirmed, setConfirmed] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [status, setStatus] = useState("Pending");
  const [userId, setUserId] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  interface BurnTransaction {
    nftName: string;
    txHash: string;
    created_at: string;
    status: boolean;
  }

  const [recentBurns, setRecentBurns] = useState<BurnTransaction[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Get user info when wallet connects
  useEffect(() => {
    const fetchUserData = async () => {
      if (connected && wallet) {
        try {
          // Get wallet address
          const address = await wallet.getChangeAddress();
          setWalletAddress(address);

          // Get or create user
          let user = await getUserByWalletAddress(address);
          if (!user) {
            user = await createUser(address);
          }

          setUserId(user.id);
          fetchTransactionHistory(address);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [connected, wallet]);

  // Fetch transaction history
  const fetchTransactionHistory = async (address: string) => {
    try {
      setIsLoadingHistory(true);
      const transactions = await getUserTransactions(address);
      // Filter only burn transactions
      const burnTransactions = transactions.filter(
        (tx: { transaction_type: string }) => tx.transaction_type === "burn"
      );
      setRecentBurns(burnTransactions);
    } catch (error) {
      console.error("Error fetching transaction history:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!connected) {
      alert("Please connect your wallet first");
      return;
    }

    if (!confirmed) {
      alert("Please confirm that you understand burning is permanent");
      return;
    }

    try {
      setIsLoading(true);

      // Prepare the parameters for burning the NFT
      const burnParams = [
        {
          assetName: nftName,
          quantity: "-1", // Burning 1 token
        },
      ];

      // Call the burnTokens function
      const burnTxHash = await burnTokens(wallet, burnParams);
      setTxHash(burnTxHash);

      // Create transaction record in database
      const transaction = {
        user_id: userId,
        from_address: walletAddress,
        to_address: walletAddress, // Same as from_address as requested
        transaction_type: "burn",
        amount: 1,
        txHash: burnTxHash,
      };

      const savedTransaction = await createTransaction(transaction);

      setStatus("Pending");
      setShowDetails(true);

      // Reset form
      setNftName("");
      setCollection("");
      setReason("outdated");
      setConfirmed(false);

      // Scroll to details
      setTimeout(() => {
        document
          .getElementById("burnDetails")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);

      // Check transaction status after a delay and update
      setTimeout(async () => {
        try {
          // Update transaction status to completed
          await updateTransactionStatus(savedTransaction.id, true);
          setStatus("Completed");
          // Refresh transaction history
          fetchTransactionHistory(walletAddress);
        } catch (error) {
          console.error("Error updating transaction status:", error);
        }
      }, 5000);
    } catch (error) {
      console.error("Error burning NFT:", error);
      alert(
        `Error burning NFT: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <main>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">
          Burn NFT Assets
        </h1>
        <p className="text-gray-400 mb-8">
          Permanently remove NFTs that are no longer needed from the blockchain
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="card-bg p-6">
              {!connected ? (
                <div className="text-center py-6">
                  <p className="mb-4">
                    Please connect your wallet to burn NFTs
                  </p>
                  <Button className="w-full">Connect Wallet</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="nftName">NFT Name or ID</Label>
                    <Input
                      id="nftName"
                      placeholder="Enter NFT name or ID"
                      value={nftName}
                      onChange={(e) => setNftName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="collection">Collection</Label>
                    <Select value={collection} onValueChange={setCollection}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Collection (Optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="collection0">
                          Select Collection (Optional)
                        </SelectItem>
                        <SelectItem value="collection1">
                          Digital Heirlooms
                        </SelectItem>
                        <SelectItem value="collection2">
                          Family Archives
                        </SelectItem>
                        <SelectItem value="collection3">
                          Legacy Documents
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason for Burning</Label>
                    <Select value={reason} onValueChange={setReason}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="outdated">
                          No Longer Needed
                        </SelectItem>
                        <SelectItem value="duplicate">
                          Duplicate Asset
                        </SelectItem>
                        <SelectItem value="error">Created in Error</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="confirm"
                      checked={confirmed}
                      onCheckedChange={(checked) =>
                        setConfirmed(checked === true)
                      }
                      required
                    />
                    <Label htmlFor="confirm" className="text-sm">
                      I understand that burning this NFT is permanent and cannot
                      be undone
                    </Label>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Processing..." : "Burn NFT"}
                  </Button>
                </form>
              )}
            </div>

            {showDetails && (
              <div
                id="burnDetails"
                className="card-bg p-6 border border-blue-500/30"
              >
                <h3 className="text-lg font-medium mb-4">
                  Burn Transaction Details
                </h3>
                <p className="mb-2">
                  NFT "
                  <span className="font-medium">
                    {nftName || "Unnamed NFT"}
                  </span>
                  " has been successfully queued for burning.
                </p>
                <p className="mb-2">
                  Transaction Hash: <strong>{txHash || "Processing..."}</strong>
                </p>
                <p>
                  Status:{" "}
                  <span
                    className={`${
                      status === "Completed"
                        ? "bg-green-500/10 text-green-400"
                        : "bg-yellow-500/10 text-yellow-400"
                    } px-2 py-1 rounded-full text-xs`}
                  >
                    {status}
                  </span>
                </p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="card-bg p-6">
              <h3 className="text-lg font-medium mb-4">About NFT Burning</h3>
              <div className="space-y-3">
                {[
                  "Burning an NFT permanently removes it from the blockchain",
                  "The transaction is recorded on the Cardano blockchain for transparency",
                  "Once burned, the NFT's metadata and image will no longer be accessible",
                  "Burned NFTs cannot be recovered under any circumstances",
                  "Wallet authentication is required to confirm the burn process",
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="text-blue-500 mt-1">
                      <Check size={16} />
                    </div>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-bg p-6">
              <h3 className="text-lg font-medium mb-4">When to Burn NFTs</h3>
              <div className="space-y-3">
                {[
                  "Digital assets that are no longer relevant to your legacy",
                  "Outdated documents that have been superseded by newer versions",
                  "Assets with incorrect metadata or information",
                  "Duplicate NFTs that serve the same purpose",
                  "Test NFTs created during platform exploration",
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="text-blue-500 mt-1">
                      <Check size={16} />
                    </div>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h3 className="text-xl font-bold mb-4">Recent Burns</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 font-normal text-gray-400">
                    NFT Name
                  </th>
                  <th className="text-left py-3 px-4 font-normal text-gray-400">
                    Transaction Hash
                  </th>
                  <th className="text-left py-3 px-4 font-normal text-gray-400">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 font-normal text-gray-400">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoadingHistory ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-center">
                      Loading transaction history...
                    </td>
                  </tr>
                ) : recentBurns.length > 0 ? (
                  recentBurns.map((burn, index) => (
                    <tr key={index} className="border-b border-white/10">
                      <td className="py-3 px-4">
                        {burn.nftName || nftName || `NFT #${index + 1}`}
                      </td>
                      <td className="py-3 px-4 text-sm truncate max-w-xs">
                        {burn.txHash}
                      </td>
                      <td className="py-3 px-4">
                        {formatDate(burn.created_at)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`${
                            burn.status
                              ? "bg-green-500/10 text-green-400"
                              : "bg-yellow-500/10 text-yellow-400"
                          } px-2 py-1 rounded-full text-xs`}
                        >
                          {burn.status ? "Completed" : "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-4 text-center">
                      No burn transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
