import connectionPool from '@/db';
import generateSecureToken from '@/Helper/helper';
import { cookies } from 'next/headers';

export async function POST(req: Request) {

    const { email  } = await req.json();
    let { password } = await req.json();
    console.log(email, password);
    debugger;
    let userToken;
    password = generateSecureToken(password);
    try {
        const result = await connectionPool.query(`
            Select * from users where "Email" = '${email}' And "Password" = '${password}'`)
        if (result.rows.length > 0) {

            userToken = generateSecureToken(email + password + Date.now());
            
            await connectionPool.query(`
            update users set "token" = '${userToken}' where "Email" = '${email}' And "Password" = '${password}'`)

            const cookie = await cookies();
            await cookie.set('auth', JSON.stringify({ token: userToken, role: result.rows[0].role }), {
                httpOnly: true,
                maxAge: 60 * 60 * 24 * 7,
            });

            // We set the cookie in the response header.
            return new Response(JSON.stringify({
                success: true, message: 'Logged in successfully.',
                user: {
                    id: result.rows[0].Id,
                    username: result.rows[0].Name,
                    email: result.rows[0].Email,
                    token: userToken,
                    role: result.rows[0].role,
                },
            }), {
                status: 200,
                headers: {
                    'Set-Cookie': cookie.toString(),
                    'Content-Type': 'application/json'
                },
            });
        } else {
            // If credentials are wrong, send an error.
            return new Response(JSON.stringify({ success: false, message: 'Invalid credentials.' }));
        }
    } catch (error) {
        console.error('Error during login:', error);
        return new Response(JSON.stringify({ success: false, message: 'Internal server error.' }));
    }
}

