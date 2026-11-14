import nextVitals from "eslint-config-next/core-web-vitals";

export default [
  ...nextVitals,
  {
    ignores: [".next/**", ".open-next/**", "node_modules/**", "cloudflare-env.d.ts"]
  }
];
