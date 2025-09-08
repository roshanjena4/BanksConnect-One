import connectionPool from '@/db';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const userCookie = cookieStore.get("auth")?.value;
        if (userCookie) {
            const parsed = JSON.parse(userCookie);
            const userToken = parsed.token;

            //debugger;
    const result = await connectionPool.query(`SELECT get_user_details_by_token_v2('${userToken}');`);
            if (result.rows.length > 0){
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
        } else {
            return new Response(JSON.stringify({ success: false, message: 'No user found.' }));
        }
    } catch (error) {
        console.error('Error during user retrieval:', error);
        return new Response(JSON.stringify({ success: false, message: 'Internal server error.' }), { status: 500 });
    }
}