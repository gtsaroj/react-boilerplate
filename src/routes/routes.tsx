import { lazy } from "react";

const Home = lazy(() => import("@/pages/home/home").then(component => ({ default: component.default })));
const About = lazy(() => import("@/pages/about/about").then(component => ({ default: component.default })));

interface Router {
  [path: string]: {
    requireAuth?: boolean;
    isAccessPublicOnly?: boolean;
    isAccessToAnyOne?: boolean;
    element: React.ReactNode;
  };
}

export const routers: Router = {
  "/": {
    element: <Home />,
    isAccessToAnyOne: true
  },
  "/about": {
    element: <About />,
    isAccessToAnyOne: true
  }
};
