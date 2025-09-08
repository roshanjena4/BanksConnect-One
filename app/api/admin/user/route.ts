import connectionPool from '@/db';
import generateSecureToken from '@/Helper/helper';

export async function GET(){
    const result = await connectionPool.query(`
        SELECT "Id", "Name" FROM users
    `);
    const result1 = await connectionPool.query(`
        SELECT "id", "name","code" FROM banks
    `);
     if (result.rows.length > 0) {
        return new Response(JSON.stringify({
            success: true, data: { users: result.rows, banks: result1.rows }
        }), {
            headers: {
                'Content-Type': 'application/json'
            },
        });
    } else {
        return new Response(JSON.stringify({ success: false, message: 'No users found.' }));
    }
}

export async function PUT(req : Request){
    const { userId, name, email, phone, role,status } = await req.json();
    
    try {
        const result = await connectionPool.query(`
            UPDATE users SET "Name" = $1, "Email" = $2, "Phone" = $3, "role" = $4, "Status" = $5
            WHERE "Id" = $6
            RETURNING *;
        `, [name, email, phone, role, status, userId]);

        if (result.rows.length > 0) {
            return new Response(JSON.stringify({ success: true, data: result.rows[0], message: 'User updated successfully.' }), {
                headers: { 'Content-Type': 'application/json' }
            });
        } else {
            return new Response(JSON.stringify({ success: false, message: 'User not found.' }), { status: 404 });
        }
    } catch (error) {
        console.error('Error updating user:', error);
        return new Response(JSON.stringify({ success: false, message: 'Internal server error.' }), { status: 500 });
    }
}
//             RETURNING *;
//         `, [bankName, bankCode, location, bankEmail, bankId]);

//         if (result.rows.length > 0) {
//             return new Response(JSON.stringify({ success: true, data: result.rows[0], message: 'Bank updated successfully.' }), {
//                 headers: { 'Content-Type': 'application/json' }
//             });
//         } else {
//             return new Response(JSON.stringify({ success: false, message: 'Bank not found.' }), { status: 404 });
//         }
//     } catch (error) {
//         console.error('Error updating bank:', error);
//         return new Response(JSON.stringify({ success: false, message: 'Internal server error.' }), { status: 500 });
//     }
// }

export async function DELETE(req: Request) {

    try {
        const { userId } = await req.json();
        console.log("Request body:", { userId });
        let result = undefined;
        const user = await connectionPool.query(
            'Select "Status" from users where "Id" = $1',
            [userId]
        )
        if (user.rows[0].Status === 'blocked') {
            result = await connectionPool.query(`
            UPDATE users SET "Status" = 'active' WHERE "Id" = $1
            RETURNING *;
        `, [userId]);

            if (result.rows.length > 0) {
                return new Response(JSON.stringify({
                    success: true,
                    message: 'User activated successfully.'
                }), {
                    headers: { "Content-Type": "application/json" }
                });
            } else {
                return new Response(JSON.stringify({ success: false, message: "Failed to delete user." }));
            }

        }
        else {
            result = await connectionPool.query(`
            UPDATE users SET "Status" = 'blocked' WHERE "Id" = $1
            RETURNING *;
        `, [userId]);

            if (result.rows.length > 0) {
                return new Response(JSON.stringify({
                    success: true,
                    message: 'User deleted successfully.'
                }), {
                    headers: { "Content-Type": "application/json" }
                });
            } else {
                return new Response(JSON.stringify({ success: false, message: "Failed to delete user." }));
            }
        }
    } catch (error) {
        console.error('Error deleting user :', error);
        return new Response(JSON.stringify({ success: false, message: 'Internal server error.' }));
    }
}