import connectionPool from '@/db';
import generateSecureToken from '@/Helper/helper';
import { cookies } from 'next/headers';


export async function GET() {

    //debugger;
    try {

        const cookieStore = await cookies();
        const userCookie = cookieStore.get("auth")?.value;
        if (userCookie) {
            const parsed = JSON.parse(userCookie);
            const userToken = parsed.token;

            const result = await connectionPool.query(`
           Select * from users where "token" = '${userToken}'
       `)
            if (result.rows.length > 0) {

                // We set the cookie in the response header.
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
        }
        else{
            return new Response(JSON.stringify({ success: false, message: 'No user found.' }));
        }
    } catch (error) {
        console.error('Error during user retrieval:', error);
        return new Response(JSON.stringify({ success: false, message: 'Internal server error.' }), { status: 500 });
    }
}

export async function POST(req: Request) {
    const { name, email, phone, role, status } = await req.json();
    let {password } = await req.json();
    try {
        password = generateSecureToken(password);
        const result = await connectionPool.query(`
               Insert into users ("Name", "Email", "Password","Phone","role","Status") values ('${name}', '${email}', '${password}', '${phone}', '${role}', '${status}') `)
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

