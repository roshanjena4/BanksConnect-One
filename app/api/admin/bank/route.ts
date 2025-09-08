import connectionPool from '@/db';

export async function GET(){
    const result = await connectionPool.query(`
        SELECT b.*,
        COUNT(a."Id") AS total_accounts,
        COALESCE(SUM(a.balance), 0) AS total_balance
        FROM banks b
        left join accounts as a on b.id = a.bankid
        group by b.id
		ORDER BY b."id"
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

export async function POST(request: Request) {

    const { bankName, bankCode, bankEmail, location } = await request.json();
    try {
        const result = await connectionPool.query(`
            INSERT INTO banks ("name", "code","address", "contactemail") 
            VALUES ($1,$2,$3,$4)
        `, [bankName, bankCode, location, bankEmail]);

        return new Response(JSON.stringify({
            success: true, message: 'Bank Added successfully.'
        }), {
            headers: {
                'Content-Type': 'application/json'
            },
        });
    } catch (error) {
        console.error('Error during bank creation:', error);
        return new Response(JSON.stringify({ success: false, message: 'Internal server error.' }));
    }
}

export async function PUT(req : Request){
    const { bankId, bankName, bankCode, bankEmail, location } = await req.json();
    
    try {
        const result = await connectionPool.query(`
            UPDATE banks SET "name" = $1, "code" = $2, "address" = $3, "contactemail" = $4 
            WHERE id = $5
            RETURNING *;
        `, [bankName, bankCode, location, bankEmail, bankId]);

        if (result.rows.length > 0) {
            return new Response(JSON.stringify({ success: true, data: result.rows[0], message: 'Bank updated successfully.' }), {
                headers: { 'Content-Type': 'application/json' }
            });
        } else {
            return new Response(JSON.stringify({ success: false, message: 'Bank not found.' }), { status: 404 });
        }
    } catch (error) {
        console.error('Error updating bank:', error);
        return new Response(JSON.stringify({ success: false, message: 'Internal server error.' }), { status: 500 });
    }
}

export async function DELETE(req: Request) {

    try {
        const { bankId } = await req.json();
        console.log("Request body:", { bankId });
        let result = undefined;
        const bank = await connectionPool.query(
            'Select status from banks where id = $1',
            [bankId]
        )
        if (bank.rows[0].status === 'blocked') {
            result = await connectionPool.query(`
            UPDATE banks SET "status" = 'active' WHERE "id" = $1
            RETURNING *;
        `, [bankId]);

            if (result.rows.length > 0) {
                return new Response(JSON.stringify({
                    success: true,
                    message: 'Bank activated successfully.'
                }), {
                    headers: { "Content-Type": "application/json" }
                });
            } else {
                return new Response(JSON.stringify({ success: false, message: "Failed to delete bank." }));
            }

        }
        else {
            result = await connectionPool.query(`
            UPDATE banks SET "status" = 'blocked' WHERE "id" = $1
            RETURNING *;
        `, [bankId]);

            if (result.rows.length > 0) {
                return new Response(JSON.stringify({
                    success: true,
                    message: 'Bank deleted successfully.'
                }), {
                    headers: { "Content-Type": "application/json" }
                });
            } else {
                return new Response(JSON.stringify({ success: false, message: "Failed to delete bank." }));
            }
        }
    } catch (error) {
        console.error('Error deleting bank:', error);
        return new Response(JSON.stringify({ success: false, message: 'Internal server error.' }));
    }
}
