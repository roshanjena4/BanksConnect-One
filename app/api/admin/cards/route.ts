import connectionPool from '@/db';

export async function GET() {
    const result = await connectionPool.query(`
       SELECT * 
       from cards
       ORDER BY "id"
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
    const body = await req.json();
    const { accountNumber, cardType, cardHolderName, expiry, cardStatus } = body;
    const cvv = Math.floor(Math.random() * 900) + 100; // Generate a random 3-digit CVV
    const cardNumber = Math.floor(Math.random() * 9000000000000000) + 1000000000000000; // Generate a random 16-digit card number
    // Validate the request body
    // if (!accountNo  || !cardType || !ownerName || !expiryDate|| !cardStatus) {
    //     return new Response(JSON.stringify({ success: false, message: 'All fields are required.' }), {
    //         status: 400,
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //     });
    // }

    // Insert the new card into the database
    const result = await connectionPool.query(`
        INSERT INTO cards (account_no, card_number, card_type, cardholder_name, expiry_date, cvv, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
    `, [accountNumber, cardNumber, cardType, cardHolderName, expiry, cvv, cardStatus]);

    if (result.rows.length > 0) {
        return new Response(JSON.stringify({
            success: true, data: result.rows[0]
        }), {
            headers: {
                'Content-Type': 'application/json'
            },
        });
    } else {
        return new Response(JSON.stringify({ success: false, message: 'Failed to create card.' }));
    }
}

export async function DELETE(req: Request) {
    const { card_number } = await req.json();

    if (!card_number) {
        return new Response(JSON.stringify({ success: false, message: 'Card number is required.' }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            },
        });
    }

    console.log("Request body:", { card_number });
    const card = await connectionPool.query(
        'SELECT status FROM cards WHERE card_number = $1',
        [card_number]
    );

    if (card.rows.length === 0) {
        return new Response(JSON.stringify({ success: false, message: 'Card not found.' }), {
            status: 404,
            headers: {
                'Content-Type': 'application/json'
            },
        });
    }

    const status = card.rows[0].status;
    const newStatus = status === 'blocked' ? 'active' : 'blocked';

    const result = await connectionPool.query(`
        UPDATE cards SET status = $1 WHERE card_number = $2
        RETURNING *;
    `, [newStatus, card_number]);

    if (result.rows.length > 0) {
        return new Response(JSON.stringify({
            success: true,
            message: `${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}d successfully.`
        }), {
            headers: { "Content-Type": "application/json" }
        });
    } else {
        return new Response(JSON.stringify({ success: false, message: "Failed to delete card." }));
    }
}

export async function PUT(req: Request) {
    try {
        const { card_number, account_no, card_type, cardholder_name, expiry_date, status } = await req.json();
        if (!card_number) {
            return new Response(JSON.stringify({ success: false, message: 'card_number is required' }), { status: 400 });
        }
        const result = await connectionPool.query(`
            UPDATE cards SET account_no = $1, card_type = $2, cardholder_name = $3, expiry_date = $4, status = $5
            WHERE card_number = $6
            RETURNING *;
        `, [account_no, card_type, cardholder_name, expiry_date, status, card_number]);

        if (result.rows.length > 0) {
            return new Response(JSON.stringify({ success: true, data: result.rows[0] }), { headers: { 'Content-Type': 'application/json' } });
        }
        return new Response(JSON.stringify({ success: false, message: 'Card not found.' }), { status: 404 });
    } catch (error) {
        console.error('Error updating card:', error);
        return new Response(JSON.stringify({ success: false, message: 'Internal server error.' }), { status: 500 });
    }
}
