"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useWallet } from '@meshsdk/react'
import lock from "@/service/vesting/lock"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { Asset } from "@meshsdk/core"

// Function to save transaction activity in localStorage
const saveActivity = (
  type: 'lock' | 'unlock',
  walletAddress: string,
  timestamp: string,
  txHash?: string,
  getAddress?: string 
) => {
  const activities = JSON.parse(localStorage.getItem('activities') || '[]');

  const newActivity = {
    type,
    walletAddress,
    timestamp,
    txHash,
    getAddress, 
  };

  activities.unshift(newActivity);
  localStorage.setItem('activities', JSON.stringify(activities));
};

// Interface for NFT asset input
interface NftAssetInput {
  policyId: string;
  assetName: string;
  quantity: string;
}

// Interface for API user response
interface UserResponse {
  success: boolean;
  data: {
    id: number;
    wallet_address: string;
  };
}

// Interface for API transaction response
interface TransactionResponse {
  success: boolean;
  data: {
    id: number;
  };
}

// Interface for transaction history
interface Transaction {
  id: number;
  user_id: number;
  from_address: string;
  to_address: string;
  transaction_type: string;
  amount: string;
  txHash: string;
  status: boolean;
  create_at: string;
  expire_at: string;
}

export default function LockAssets() {
  const [beneficiary, setBeneficiary] = useState("")
  const [lovelace, setLovelace] = useState("")
  const [lockUntil, setLockUntil] = useState<Date | null>(null)
  const [instructions, setInstructions] = useState("")
  const [nftAssets, setNftAssets] = useState<NftAssetInput[]>([{ policyId: "", assetName: "", quantity: "1" }])
  const [txHash, setTxHash] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [transactionSuccess, setTransactionSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dbSaveStatus, setDbSaveStatus] = useState<string | null>(null)
  const [transactionHistory, setTransactionHistory] = useState<Transaction[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  
  const { connected, wallet } = useWallet();

  // Fetch transaction history when wallet is connected
  useEffect(() => {
    
const fetchTransactionHistory = async () => {
  if (!connected) return;
  
  try {
    setIsLoadingHistory(true);
    const walletAddresses = await wallet.getUsedAddresses();
    if (!walletAddresses || walletAddresses.length === 0) {
      return;
    }
    
    const walletAddress = walletAddresses[0];
    
    // First get the user ID from wallet address
    const userResponse = await fetch(`/api/user?walletAddress=${walletAddress}`);
    
    if (!userResponse.ok) {
      console.error("Error fetching user:", await userResponse.text());
      throw new Error(`Error fetching user: ${userResponse.status}`);
    }
    
    const userData = await userResponse.json();
    
    if (!userData.success || !userData.data) {
      console.error("No user found for wallet address");
      setTransactionHistory([]);
      return;
    }
    
    const userId = userData.data.id;
    
    // Now fetch transactions with the user ID
    const txResponse = await fetch(`/api/transactions?userId=${userId}`);
    
    if (!txResponse.ok) {
      console.error("Error fetching transactions:", await txResponse.text());
      throw new Error(`Error fetching transaction history: ${txResponse.status}`);
    }
    
    const data = await txResponse.json();
    if (data.success) {
      // Filter transactions where from_address matches the current wallet
      const filteredTransactions = data.data.filter(
        (tx: { from_address: string }) => tx.from_address === walletAddress
      );
      setTransactionHistory(filteredTransactions);
    }
  } catch (error) {
    console.error("Error fetching transaction history:", error);
  } finally {
    setIsLoadingHistory(false);
  }
};

    if (connected) {
      fetchTransactionHistory();
    }
  }, [connected, wallet, transactionSuccess]); // Refresh after successful transaction

  const addNftAsset = () => {
    setNftAssets([...nftAssets, { policyId: "", assetName: "", quantity: "1" }])
  }

  const updateNftAsset = (index: number, field: keyof NftAssetInput, value: string) => {
    const newNftAssets = [...nftAssets]
    newNftAssets[index][field] = value
    setNftAssets(newNftAssets)
  }

  const removeNftAsset = (index: number) => {
    if (nftAssets.length === 1) {
      setNftAssets([{ policyId: "", assetName: "", quantity: "1" }])
    } else {
      const newNftAssets = [...nftAssets]
      newNftAssets.splice(index, 1)
      setNftAssets(newNftAssets)
    }
  }

  const validateForm = (): boolean => {
    // Reset previous error
    setError(null)
    
    // Check if wallet is connected
    if (!connected) {
      setError("Please connect your wallet first.")
      return false
    }
    
    // Validate beneficiary address
    if (!beneficiary.trim()) {
      setError("Please enter a beneficiary address.")
      return false
    }

    // Basic address validation (starting with "addr")
    if (!beneficiary.trim().startsWith("addr")) {
      setError("Please enter a valid Cardano address starting with 'addr'.")
      return false
    }

    // Validate ADA amount
    if (!lovelace || isNaN(parseFloat(lovelace)) || parseFloat(lovelace) <= 0) {
      setError("Please enter a valid ADA amount (greater than 0).")
      return false
    }

    // Validate lock date
    if (!lockUntil) {
      setError("Please select a lock date and time.")
      return false
    }

    // Check if lock time is in the future
    if (lockUntil.getTime() <= new Date().getTime()) {
      setError("Please select a future date and time for locking.")
      return false
    }
    
    // Validate NFT fields
    for (const asset of nftAssets) {
      if (asset.policyId || asset.assetName || asset.quantity !== "1") {
        if (!asset.policyId || !asset.assetName) {
          setError("All NFT fields (Policy ID and Asset Name) must be filled in.")
          return false
        }
        
        const quantity = parseInt(asset.quantity)
        if (isNaN(quantity) || quantity <= 0) {
          setError("NFT Quantity must be a positive number.")
          return false
        }
      }
    }
    
    return true
  }

  // Function to save user to database
  const saveUserToDatabase = async (walletAddress: string): Promise<number> => {
    try {
      // Add error handling for the fetch operation
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress }),
      });
      
      // Check if response is OK before parsing JSON
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data: UserResponse = await response.json();
      
      if (!data.success) {
        throw new Error('Failed to save user');
      }
      
      return data.data.id;
    } catch (error) {
      console.error("Error saving user:", error);
      throw error;
    }
  };

  // Function to save transaction to database
  const saveTransactionToDatabase = async (
    userId: number,
    fromAddress: string,
    toAddress: string,
    amount: string,
    txHash: string,
    expireAt: Date
  ) => {
    try {
      // Add error handling for the fetch operation
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          from_address: fromAddress,
          to_address: toAddress,
          transaction_type: 'lock',
          amount: amount,
          txHash: txHash,
          expire_at: expireAt.toISOString(),
        }),
      });
      
      // Check if response is OK before parsing JSON
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data: TransactionResponse = await response.json();
      
      if (!data.success) {
        throw new Error('Failed to save transaction');
      }
      
      return data.data.id;
    } catch (error) {
      console.error("Error saving transaction:", error);
      throw error;
    }
  };

  const handleLock = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      setTxHash(null);
      setTransactionSuccess(false);
      setError(null);
      setDbSaveStatus(null);
      
      const lockUntilTimeStamp = Math.floor(lockUntil!.getTime() / 1000); // Convert to timestamp in seconds
      
      // Create assets array for the transaction
      const assets: Asset[] = [
        { 
          unit: "lovelace", 
          quantity: (parseFloat(lovelace) * 1000000).toString() 
        }
      ];
      
      // Add NFT assets if provided
      for (const asset of nftAssets) {
        if (asset.policyId && asset.assetName) {
          // Convert hex string to bytes for assetName if needed
          let assetNameHex = asset.assetName;
          if (!assetNameHex.match(/^[0-9a-fA-F]*$/)) {
            // Convert text to hex if it's not already a hex string
            assetNameHex = Buffer.from(asset.assetName).toString('hex');
          }
          
          assets.push({
            unit: asset.policyId + assetNameHex,
            quantity: asset.quantity
          });
        }
      }
      
      // Get wallet address
      const walletAddresses = await wallet.getUsedAddresses();
      if (!walletAddresses || walletAddresses.length === 0) {
        throw new Error("Could not retrieve wallet address");
      }
      const walletAddress = walletAddresses[0];
      
      // Execute lock transaction
      const resultTxHash = await lock(wallet, beneficiary, assets, lockUntilTimeStamp);
      setTxHash(resultTxHash);
      setTransactionSuccess(true);
      
      // Save activity to localStorage
      const timestamp = new Date().toISOString();
      saveActivity('lock', walletAddress, timestamp, resultTxHash, beneficiary);
      
      // Save data to database
      try {
        // Step 1: Register or get the user
        const userId = await saveUserToDatabase(walletAddress);
        console.log("User saved with ID:", userId);
        
        // Step 2: Save the transaction
        const transactionId = await saveTransactionToDatabase(
          userId,
          walletAddress,
          beneficiary,
          (parseFloat(lovelace)).toString(), // Save the ADA amount
          resultTxHash,
          lockUntil!
        );
        console.log("Transaction saved with ID:", transactionId);
        
        setDbSaveStatus("Transaction saved to database successfully");
      } catch (dbError) {
        console.error("Database error:", dbError);
        setDbSaveStatus(`Database save failed: ${dbError instanceof Error ? dbError.message : 'Unknown error'}`);
        // We don't throw here to avoid affecting the main transaction flow
      }
      
    } catch (error) {
      console.error("Error locking assets:", error);
      setError(`Transaction failed: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
      setTransactionSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearForm = () => {
    setBeneficiary("");
    setLovelace("");
    setLockUntil(null);
    setInstructions("");
    setNftAssets([{ policyId: "", assetName: "", quantity: "1" }]);
    setError(null);
    setDbSaveStatus(null);
    // Keep txHash for reference
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Helper function to truncate transaction hash
  const truncateHash = (hash: string) => {
    if (!hash) return '';
    return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
  };

  // Helper function to get asset name
  const getAssetName = (transaction: Transaction) => {
    // This is a placeholder. In a real application, you might want to:
    // 1. Store asset names in the database
    // 2. Or fetch them from a blockchain explorer API
    // For now, we'll return a placeholder based on the transaction ID
    return `Digital Asset #${transaction.id}`;
  };

  return (
    <main>
   

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">Lock Assets</h1>
        <p className="text-gray-400 mb-8">
          Securely lock your digital assets with time-based conditions and beneficiary management
        </p>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-white px-4 py-3 rounded mb-6">
            <p>{error}</p>
          </div>
        )}

        {transactionSuccess && (
          <div className="bg-green-900/50 border border-green-500 text-white px-4 py-3 rounded mb-6">
            <p>Transaction submitted successfully!</p>
            {dbSaveStatus && <p className="mt-2">{dbSaveStatus}</p>}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Container */}
          <div className="card-bg p-6">
            <h2 className="text-xl font-bold mb-6">Asset Details</h2>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="beneficiary">Beneficiary Wallet Address</Label>
                <Input
                  id="beneficiary"
                  placeholder="addr1qxy0..."
                  value={beneficiary}
                  onChange={(e) => setBeneficiary(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lovelace">Amount to Lock (ADA)</Label>
                <Input
                  id="lovelace"
                  type="number"
                  placeholder="Enter amount in ADA"
                  value={lovelace}
                  onChange={(e) => setLovelace(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lockUntil">Lock Until (Date & Time)</Label>
                <DatePicker
                  selected={lockUntil}
                  onChange={(date: Date | null) => setLockUntil(date)}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="MMMM d, yyyy h:mm aa"
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholderText="Select date and time"
                  minDate={new Date()}
                  wrapperClassName="w-full"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label>NFT Assets</Label>

                {nftAssets.map((asset, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">NFT #{index + 1}</h4>
                      {nftAssets.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeNftAsset(index)}
                          disabled={isLoading}
                        >
                          Remove
                        </Button>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`policyId-${index}`}>Policy ID</Label>
                      <Input
                        id={`policyId-${index}`}
                        placeholder="Enter Policy ID"
                        value={asset.policyId}
                        onChange={(e) => updateNftAsset(index, "policyId", e.target.value)}
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`assetName-${index}`}>Asset Name</Label>
                      <Input
                        id={`assetName-${index}`}
                        placeholder="Enter Asset Name"
                        value={asset.assetName}
                        onChange={(e) => updateNftAsset(index, "assetName", e.target.value)}
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                      <Input
                        id={`quantity-${index}`}
                        type="number"
                        placeholder="Enter quantity"
                        value={asset.quantity}
                        onChange={(e) => updateNftAsset(index, "quantity", e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                ))}

                <Button
                  variant="outline"
                  className="w-full border-dashed border-white/30 text-white/70 hover:text-white"
                  onClick={addNftAsset}
                  disabled={isLoading}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Another NFT
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructions">Special Instructions</Label>
                <Textarea
                  id="instructions"
                  placeholder="Add any special instructions or wishes for the beneficiary"
                  rows={4}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <Button 
                  variant="outline"
                  onClick={handleClearForm}
                  disabled={isLoading}
                >
                  Clear Form
                </Button>
                <Button
                  className="gradient-bg text-white"
                  onClick={handleLock}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : 'Lock Assets'}
                </Button>
              </div>
            </div>
          </div>

          {/* Preview Container */}
          <div className="card-bg p-6">
            <h2 className="text-xl font-bold mb-6">Preview</h2>

            <div className="space-y-4">
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-2">Beneficiary</h3>
                <p className="text-gray-300 break-all">{beneficiary || "addr1qxy0..."}</p>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-2">ADA Amount</h3>
                <p className="text-gray-300">{lovelace ? parseFloat(lovelace).toLocaleString() : "0"} ₳</p>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-2">Lock Until</h3>
                <p className="text-gray-300">
                  {lockUntil ? lockUntil.toLocaleString() : "Not specified"}
                </p>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-2">NFT Assets</h3>
                {nftAssets.some(asset => asset.policyId || asset.assetName || asset.quantity !== "1") ? (
                  nftAssets.map((asset, index) => (
                    <div key={index} className="mb-2">
                      {(asset.policyId || asset.assetName) && (
                        <p className="text-gray-300">
                          <strong>Policy ID:</strong> <span className="break-all">{asset.policyId || "Not specified"}</span>
                          <br />
                          <strong>Asset Name:</strong> {asset.assetName || "Not specified"}
                          <br />
                          <strong>Quantity:</strong> {asset.quantity || "1"}
                          {asset.policyId && asset.assetName && (
                            <>
                              <br />
                              <strong>Unit:</strong> <span className="break-all">{asset.policyId}{asset.assetName.match(/^[0-9a-fA-F]*$/) ? asset.assetName : Buffer.from(asset.assetName).toString('hex')}</span>
                            </>
                          )}
                        </p>
                      )}
                      {index < nftAssets.length - 1 && asset.policyId && asset.assetName && <hr className="border-white/10 my-2" />}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-300">No NFT assets specified</p>
                )}
              </div>

              {instructions && (
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2">Special Instructions</h3>
                  <p className="text-gray-300">{instructions}</p>
                </div>
              )}

              {/* Transaction Hash Display */}
              {txHash && (
                <div className={`bg-white/5 rounded-lg p-4 ${transactionSuccess ? 'border border-green-500' : ''}`}>
                  <h3 className="text-lg font-medium mb-2">Transaction Result</h3>
                  <p className="text-gray-300">
                    <strong>Transaction Hash:</strong>
                    <br />
                    <code className="block bg-black/30 p-2 rounded mt-1 overflow-auto break-all">{txHash}</code>
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(txHash)
                        alert('Transaction hash copied to clipboard')
                      }}
                    >
                      Copy Hash
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        window.open(`https://preprod.cardanoscan.io/transaction/${txHash}`, '_blank')
                      }}
                    >
                      View on Explorer
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Transaction History Section */}
        <div className="mt-12 card-bg p-6">
          <h2 className="text-xl md:text-2xl font-bold mb-6">Transaction History</h2>
          
          {!connected ? (
            <div className="bg-white/5 rounded-lg p-6 text-center">
              <p className="text-gray-400">Connect your wallet to view transaction history</p>
            </div>
          ) : isLoadingHistory ? (
            <div className="bg-white/5 rounded-lg p-6 text-center">
              <svg className="animate-spin h-8 w-8 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-400 mt-4">Loading transaction history...</p>
            </div>
          ) : transactionHistory.length === 0 ? (
            <div className="bg-white/5 rounded-lg p-6 text-center">
              <p className="text-gray-400">No transaction history found for this wallet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-gray-700">
                    <th className="pb-3">Asset</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Transaction ID</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactionHistory.map((tx) => (
                    <tr key={tx.id} className="border-b border-gray-800/50">
                      <td className="py-4">{`${parseFloat(tx.amount).toLocaleString()} ADA`}</td>
                      <td className="py-4">{formatDate(tx.create_at)}</td>
                      <td className="py-4">
                        <a 
                          href={`https://preprod.cardanoscan.io/transaction/${tx.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-blue-400"
                        >
                          {truncateHash(tx.txHash)}
                        </a>
                      </td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-md text-xs ${tx.status ? 'bg-green-900/50 text-green-400' : 'bg-yellow-900/50 text-yellow-400'}`}>
                          {tx.status ? 'completed' : 'pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}