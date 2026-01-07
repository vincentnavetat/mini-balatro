import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("routes/game-layout.tsx", [
    index("routes/play.tsx"),
    route("shop", "routes/shop.tsx"),
    route("game-over", "routes/game-over.tsx"),
    route("game-won", "routes/game-won.tsx"),
  ])
] satisfies RouteConfig;
