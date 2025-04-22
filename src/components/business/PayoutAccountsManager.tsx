
import React from 'react';
import { Ban } from 'lucide-react';

// Using Ban icon as a replacement since Bank doesn't exist in lucide-react
const PayoutAccountsManager = () => {
  return (
    <div>
      <h2>Payout Accounts Manager</h2>
      <div className="flex items-center">
        <Ban className="mr-2" />
        <span>Bank Account Management</span>
      </div>
    </div>
  );
};

export default PayoutAccountsManager;
