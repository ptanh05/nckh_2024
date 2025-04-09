// services/transactionService.js

// Helper function to handle API responses
async function fetchAPI(endpoint, method = 'GET', data = null) {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
  
    if (data) {
      options.body = JSON.stringify(data);
    }
  
    const response = await fetch(`/api/${endpoint}`, options);
    const json = await response.json();
  
    if (!json.success) {
      throw new Error(json.message || 'API request failed');
    }
  
    return json.data;
  }
  
  // Create a new user if they don't exist
  export async function createUser(walletAddress) {
    return await fetchAPI('user', 'POST', { walletAddress });
  }
  
  // Get user by wallet address
  export async function getUserByWalletAddress(walletAddress) {
    try {
      return await fetchAPI(`user?walletAddress=${walletAddress}`);
    } catch (error) {
      if (error.message === 'User not found') {
        return null;
      }
      throw error;
    }
  }
  
  // Create a new transaction
  export async function createTransaction(transaction) {
    return await fetchAPI('transactions', 'POST', transaction);
  }
  
  // Get transactions created by user
  export async function getUserTransactions(userId) {
    return await fetchAPI(`transactions?userId=${userId}`);
  }
  
  // Get transactions sent to a specific wallet address
  export async function getReceivedTransactions(walletAddress) {
    return await fetchAPI(`transactions?walletAddress=${walletAddress}&type=received`);
  }
  export async function updateTransactionStatus(
    transactionId, 
    status, 
    transactionType  // cho phép truyền chuỗi, null hoặc undefined
  ) {
    const payload = { status };
    if (transactionType) {
      payload.transaction_type = transactionType;
    }
    return await fetchAPI(`transactions/${transactionId}`, 'PATCH', payload);
  }
  