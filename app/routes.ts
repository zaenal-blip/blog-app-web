import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [index("routes/home.tsx"),
route("/login", "routes/login.tsx"),
route("/register", "routes/register.tsx"),
route("/blogs/:slug", "routes/blog.tsx"),
route("/create", "routes/create-blog.tsx"),
route("/profile", "routes/profile.tsx"),
route("/forgot-password", "routes/forgot-password.tsx"),
route("/reset-password/:token", "routes/reset-password.tsx")
] satisfies RouteConfig;
