export { auth as proxy } from "./auth";

export const config = {
  matcher: ["/employer/:path*", "/seeker/:path*", "/messages/:path*", "/admin/:path*", "/api/employer/:path*", "/api/seeker/:path*", "/api/messages/:path*", "/api/admin/:path*"],
};