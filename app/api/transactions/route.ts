import connectionPool from '@/db';

export async function POST(request: Request) {
  debugger;
  const body = await request.json();
  const { fromAccount, toAccount, amount, category, description } = body;
  const safeToAccount = toAccount && typeof toAccount === "string" && toAccount.trim() !== "" ? toAccount : null;
  try {
    if(safeToAccount && fromAccount === safeToAccount) {
      return new Response(JSON.stringify({ error: 'Cannot transfer to the same account.' }));
    }
    
    if (safeToAccount) {
      const status = await connectionPool.query(
        'select status from accounts where accountnumber = $1',
        [safeToAccount]
      );
      if(status.rows[0].status === 'blocked')
      {
        return new Response(JSON.stringify({ success: false, message: 'Transaction declined: recipient account is currently blocked.' }));
      }
      await connectionPool.query(
        'UPDATE accounts SET balance = balance + $1 WHERE accountnumber = $2',
        [amount, safeToAccount]
      );
      
      await connectionPool.query(  
        'INSERT INTO transactions (from_account_id,to_account_id, amount, category, description, transaction_type,status) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [safeToAccount, fromAccount, amount, category, description, 'credit', 'Success']
      );
    }
    const result = await connectionPool.query(
      'INSERT INTO transactions (from_account_id,to_account_id, amount, category, description, transaction_type,status) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [fromAccount, safeToAccount, amount, category, description, 'debit', 'Success']
    );
    const updateAccount = await connectionPool.query(
      'UPDATE accounts SET balance = balance - $1 WHERE accountnumber = $2',
      [amount, fromAccount]
    );

    // if(result.)
    return new Response(JSON.stringify({ success: true, message: 'Funds transferred successfully.' }), { status: 201 });
  } catch (error) {
    console.error('Error inserting transaction:', error);
    return new Response(JSON.stringify({ error: 'Failed to create transaction.' }));
  }
}