import connectionPool from '@/db';


export async function GET() {

    //debugger;
    try {

        const result = await connectionPool.query(`
           SELECT 
                u.*,
                COUNT(a."Id") AS total_accounts,
                COALESCE(SUM(a.balance), 0) AS total_balance
            FROM users u
            LEFT JOIN accounts a 
                ON a.userid = u."Id"
            GROUP BY u."Id", u."Name"
            ORDER BY u."Id";
            `)
        if (result.rows.length > 0) {

            return new Response(JSON.stringify({
                success: true, data: result.rows
            }), {
                headers: {
                    'Content-Type': 'application/json'
                },
            });
        } else {
            return new Response(JSON.stringify({ success: false, message: 'Invalid token.' }));
        }

    } catch (error) {
        console.error('Error during user retrieval:', error);
        return new Response(JSON.stringify({ success: false, message: 'Internal server error.' }), { status: 500 });
    }
}