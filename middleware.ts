import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    //     //debugger;
    const userCookie = request.cookies.get("auth")?.value;

    let role: "user" | "admin" | null = null;

    if (userCookie) {
        try {
            const parsed = JSON.parse(userCookie);
            if (parsed.role === "2") role = "user";
            else if (parsed.role === "1") role = "admin";
            console.log("middleware called");

        } catch (err) {
            console.log("middleware error:", err);
        }
    }

    const currentPath = request.nextUrl.pathname;
    const isAuthPage = ["/signin", "/signup"].includes(currentPath);
    const isAdminRoute = currentPath.startsWith("/admin");
    //     console.log("Current path ", currentPath);

    // 1. Redirect logged-in users away from auth pages
    if (userCookie && isAuthPage) {
        if (role === "admin") {
            return NextResponse.redirect(new URL("/admin", request.url));
        }
        return NextResponse.redirect(new URL("/", request.url));
    }

    // 2. Block unauthenticated users from any protected route
    if (!userCookie && !isAuthPage) {
        return NextResponse.redirect(new URL("/signin", request.url));
    }

    // 3. Role-based access control
    if (role === "user" && isAdminRoute) {
        return NextResponse.redirect(new URL("/", request.url));
    }
    if (role === "admin" && !isAdminRoute && !isAuthPage) {
        return NextResponse.redirect(new URL("/admin", request.url));
    }

    return NextResponse.next();
}
export const config = {
    matcher: [
        '/',
        '/connect-bank',
        '/my-bank',
        '/payment-transfer',
        '/signin',
        '/signup',
        '/admin/:path*'
    ],
};