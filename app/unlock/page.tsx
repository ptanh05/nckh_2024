"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Lock, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import unlock from "@/service/vesting/unlock"; // import hàm unlock
import {
  createTransaction,
  getReceivedTransactions,
  getUserTransactions,
  updateTransactionStatus,
} from "@/app/services/transactionService";
import { useWallet } from "@meshsdk/react"; // hook kết nối ví

// Hàm lấy địa chỉ ví bằng cách sử dụng wallet.getChangeAddress()
const getWalletAddress = async (wallet: { getChangeAddress: () => any }) => {
  const hexAddress = await wallet.getChangeAddress();
  // Nếu cần chuyển đổi hexAddress sang bech32 thì thực hiện tại đây
  return hexAddress; // trả về địa chỉ đã ở dạng bech32 nếu có
};

export default function Unlock() {
  // Sử dụng useWallet hook để lấy trạng thái kết nối và đối tượng ví
  const { connected, wallet, connect } = useWallet();
  const [walletAddress, setWalletAddress] = useState("");
  
  interface Transaction {
    user_id: any;
    amount: any;
    id: string;
    from_address: string;
    to_address: string;
    transaction_type: string;
    create_at: string;
    txHash?: string;
    txhash?: string;
  }
  
  const [eligibleTxs, setEligibleTxs] = useState<Transaction[]>([]);
  const [historyUnlocked, setHistoryUnlocked] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  // Khi trang load, nếu ví chưa được kết nối thì gọi hàm connect
 

  // Sau khi wallet sẵn sàng, lấy địa chỉ ví qua getChangeAddress()
  useEffect(() => {
    const fetchAddress = async () => {
      if (wallet) {
        try {
          const addr = await getWalletAddress(wallet);
          setWalletAddress(addr);
        } catch (error) {
          console.error("Error getting wallet address:", error);
        }
      }
    };
    fetchAddress();
  }, [wallet]);

  // Truy vấn các giao dịch đủ điều kiện unlock:
  //  - Những giao dịch mà to_address khớp với walletAddress (đã lock)
  //  - Những giao dịch mà from_address khớp với walletAddress và transaction_type = "lock"
  async function fetchEligibleTransactions() {
    if (!walletAddress) return;
    // Lấy các giao dịch nhận được và giao dịch gửi đi
    const receivedTxs = await getReceivedTransactions(walletAddress);
    const sentTxs = await getUserTransactions(walletAddress);
  
    // Lọc chỉ những giao dịch có transaction_type === "lock"
    const filteredReceivedTxs = receivedTxs.filter(
      (tx: { transaction_type: string }) => tx.transaction_type === "lock"
    );
    const filteredSentLockTxs = sentTxs.filter(
      (tx: { transaction_type: string }) => tx.transaction_type === "lock"
    );
  
    // Gộp 2 mảng và loại trùng nếu 1 tx xuất hiện cả hai lần (dựa trên id)
    const combinedMap = new Map();
    for (const tx of filteredReceivedTxs) {
      combinedMap.set(tx.id, tx);
    }
    for (const tx of filteredSentLockTxs) {
      if (!combinedMap.has(tx.id)) {
        combinedMap.set(tx.id, tx);
      }
    }
    const dedupedTxs = Array.from(combinedMap.values());
    setEligibleTxs(dedupedTxs);
  }
  
  // Gọi fetchEligibleTransactions khi walletAddress được set
  useEffect(() => {
    if (walletAddress) {
      fetchEligibleTransactions();
    }
  }, [walletAddress]);

  // Hàm thực hiện unlock bằng cách:
  //  1. Lấy mảng txhash từ danh sách giao dịch đủ điều kiện
  //  2. Gọi hàm unlock với ví và mảng txhash
  //  3. Cập nhật trạng thái của từng giao dịch qua API PATCH (updateTransactionStatus)
  //  4. Lưu lịch sử giao dịch unlock hiển thị sau đó loại bỏ khỏi danh sách eligible
  async function handleUnlock() {
    try {
      if (!wallet || eligibleTxs.length === 0) {
        alert("No eligible transactions or wallet not connected.");
        return;
      }
      setLoading(true);
      const txHashes = eligibleTxs
        .map((tx) => tx.txHash || tx.txhash)
        .filter((hash): hash is string => hash !== undefined);
      const unlockTxHash = await unlock(wallet, txHashes);
      
      // Cập nhật từng giao dịch đã unlock (status = true & transaction_type = "unlocked")
      for (const tx of eligibleTxs) {
        await updateTransactionStatus(tx.id, true, "unlocked");
        // Tạo một giao dịch mới với transaction_type là "unlock" nhằm lưu lịch sử unlock
        const newTx = {
          user_id: tx.user_id, // giả sử giao dịch ban đầu có user_id
          from_address: walletAddress,
          to_address: walletAddress,
          transaction_type: "unlock",
          amount: tx.amount,
          txHash: unlockTxHash,
          // expire_at có thể để null hoặc tính theo logic của bạn
        };
        await createTransaction(newTx);
      }
      
      setHistoryUnlocked((prev) => [...prev, ...eligibleTxs]);
      setEligibleTxs([]);
      alert("Assets unlocked successfully. TxHash: " + unlockTxHash);
    } catch (error) {
      console.error("Unlock error:", error);
      alert("Error unlocking assets: " + error);
    } finally {
      setLoading(false);
    }
  }
  

  return (
    <main>
      

      <section className="bg-gradient-to-b from-[#4834d4] to-[#7e74f1] py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Unlock Your Digital Assets
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto">
            Access and claim your digital heritage assets securely through
            blockchain technology.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-blue-400 mb-6">
              Eligible Transactions for Unlock
            </h2>
            {eligibleTxs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="py-2 px-2 text-left text-sm text-gray-400">
                        From / To Address
                      </th>
                      <th className="py-2 px-2 text-left text-sm text-gray-400">
                        Transaction Type
                      </th>
                      <th className="py-2 px-2 text-left text-sm text-gray-400">
                        Date
                      </th>
                      <th className="py-2 px-2 text-left text-sm text-gray-400">
                        TxHash
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {eligibleTxs.map((tx) => (
                      <tr key={tx.id} className="border-b border-white/10">
                        <td className="py-3 px-2">
                          {tx.from_address} {"->"} {tx.to_address}
                        </td>
                        <td className="py-3 px-2">{tx.transaction_type}</td>
                        <td className="py-3 px-2">
                          {new Date(tx.create_at).toLocaleString()}
                        </td>
                        <td className="py-3 px-2">{tx.txHash || tx.txhash}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-400">No eligible transactions to unlock.</p>
            )}
          </CardContent>
        </Card>

        <div className="text-center my-12">
          <Button
            className="gradient-bg text-white text-lg px-8 py-6 rounded-full flex items-center gap-2"
            onClick={handleUnlock}
            disabled={loading || eligibleTxs.length === 0}
          >
            <Lock size={20} />
            {loading ? "Unlocking..." : "Unlock All Eligible Assets"}
          </Button>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-blue-400 mb-4">
              Unlock History
            </h3>
            {historyUnlocked.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="py-2 px-2 text-left text-sm text-gray-400">
                        From / To Address
                      </th>
                      <th className="py-2 px-2 text-left text-sm text-gray-400">
                        Transaction Type
                      </th>
                      <th className="py-2 px-2 text-left text-sm text-gray-400">
                        Date
                      </th>
                      <th className="py-2 px-2 text-left text-sm text-gray-400">
                        TxHash
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyUnlocked.map((tx) => (
                      <tr key={tx.id} className="border-b border-white/10">
                        <td className="py-3 px-2">
                          {tx.from_address} {"->"} {tx.to_address}
                        </td>
                        <td className="py-3 px-2">{tx.transaction_type}</td>
                        <td className="py-3 px-2">
                          {new Date(tx.create_at).toLocaleString()}
                        </td>
                        <td className="py-3 px-2">{tx.txHash || tx.txhash}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-400">No unlock history available.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Footer />
    </main>
  );
}
