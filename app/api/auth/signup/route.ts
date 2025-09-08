import connectionPool from '@/db';
import generateSecureToken from '@/Helper/helper';


export async function POST(req: Request) {

    const { name, email } = await req.json();
    let { password } = await req.json();
    debugger;
    try {
        password = generateSecureToken(password);
        const result = await connectionPool.query(`
           Insert into users ("Name", "Email", "Password") values ('${name}', '${email}', '${password}') `)
        // if (result.rows.length > 0) {

        // We set the cookie in the response header.
        return new Response(JSON.stringify({
            success: true, message: 'Registered successfully.'
        }), {
            headers: {
                'Content-Type': 'application/json'
            },
        });
    } catch (error) {
        console.error('Error during signup:', error);
        return new Response(JSON.stringify({ success: false, message: 'Internal server error.' }), { status: 500 });
    }
}


