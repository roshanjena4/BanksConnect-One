import connectionPool from '@/db';

export async function GET() {
    const result = await connectionPool.query(`
        SELECT a.*,
        users."Name" AS owner_name,
        banks."name" AS bank_name
        FROM accounts a
        left join users on a."userid" = users."Id"
        left join banks on a."bankid" = banks."id"
    `);
    if (result.rows.length > 0) {
        return new Response(JSON.stringify({
            success: true, data: result.rows
        }), {
            headers: {
                'Content-Type': 'application/json'
            },
        });
    } else {
        return new Response(JSON.stringify({ success: false, message: 'No banks found.' }));
    }
}

export async function POST(req: Request) {
    try {
        const { userid, accountnumber, accounttype, balance, bankid } = await req.json();
        console.log("Request body:", { userid, accountnumber, accounttype, balance, bankid });


        debugger;
        const result = await connectionPool.query(`
        INSERT INTO accounts ("userid", "accountnumber", "accounttype", "balance", "bankid")
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
        `, [userid, accountnumber, accounttype, balance, bankid]);

        if (result.rows.length > 0) {
            return new Response(JSON.stringify({
                success: true,
                message: result.rows[0] // or result.rows
            }), {
                headers: { "Content-Type": "application/json" }
            });
        } else {
            return new Response(JSON.stringify({ success: false, message: "Failed to create account." }));
        }

    } catch (error) {
        console.error('Error creating account:', error);
        return new Response(JSON.stringify({ success: false, message: 'Internal server error.' }));
    }
}

export async function DELETE(req: Request) {
    debugger;
    try {
        const { accountnumber } = await req.json();
        console.log("Request body:", { accountnumber });
        let result = undefined;
        const account = await connectionPool.query(
            'Select status from accounts where accountnumber = $1',
            [accountnumber]
        )
        if (account.rows[0].status === 'blocked') {
            result = await connectionPool.query(`
            UPDATE accounts SET "status" = 'active' WHERE "accountnumber" = $1
            RETURNING *;
        `, [accountnumber]);

            if (result.rows.length > 0) {
                return new Response(JSON.stringify({
                    success: true,
                    message: 'Account activated successfully.'
                }), {
                    headers: { "Content-Type": "application/json" }
                });
            } else {
                return new Response(JSON.stringify({ success: false, message: "Failed to delete account." }));
            }

        }
        else {

            result = await connectionPool.query(`
            UPDATE accounts SET "status" = 'blocked' WHERE "accountnumber" = $1
            RETURNING *;
        `, [accountnumber]);


            if (result.rows.length > 0) {
                return new Response(JSON.stringify({
                    success: true,
                    message: 'Account deleted successfully.'
                }), {
                    headers: { "Content-Type": "application/json" }
                });
            } else {
                return new Response(JSON.stringify({ success: false, message: "Failed to delete account." }));
            }
        }
    } catch (error) {
        console.error('Error deleting account:', error);
        return new Response(JSON.stringify({ success: false, message: 'Internal server error.' }));
    }
}

export async function PUT(req: Request) {
    try {
        const { accountnumber, userid, accounttype, balance, bankid, status } = await req.json();
        // simple update by accountnumber
        const result = await connectionPool.query(`
            UPDATE accounts SET "userid" = $1, "accounttype" = $2, "balance" = $3, "bankid" = $4, "status" = $5
            WHERE "accountnumber" = $6
            RETURNING *;
        `, [userid, accounttype, balance, bankid, status, accountnumber]);

        if (result.rows.length > 0) {
            return new Response(JSON.stringify({ success: true, data: result.rows[0] }), {
                headers: { 'Content-Type': 'application/json' }
            });
        }
        return new Response(JSON.stringify({ success: false, message: 'Account not found.' }), { status: 404 });
    } catch (error) {
        console.error('Error updating account:', error);
        return new Response(JSON.stringify({ success: false, message: 'Internal server error.' }), { status: 500 });
    }
}