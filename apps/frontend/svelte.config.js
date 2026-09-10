import netlifyAdapter from "@sveltejs/adapter-netlify";
import staticAdapter from "@sveltejs/adapter-static";

const staticDeployment = process.env.DEPLOY_TARGET === "static";

/** @type {import('@sveltejs/kit').Config} */
export default {
  kit: {
    // Coolify builds a static Caddy image; Netlify keeps its native adapter.
    // Both are SPAs because SSR is disabled in src/routes/+layout.js.
    adapter: staticDeployment
      ? staticAdapter({ fallback: "index.html" })
      : netlifyAdapter(),
  },
};
