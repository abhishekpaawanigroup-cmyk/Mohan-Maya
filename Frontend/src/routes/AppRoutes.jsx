import { lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import WebsiteLayout from "../layouts/WebsiteLayout";

// Lazy-load pages so each route ships its own chunk (faster first paint).
const Home = lazy(() => import("../pages/website/Home/Home"));
const About = lazy(() => import("../pages/website/About/About"));
const Shop = lazy(() => import("../pages/website/Shop/Shop"));
const Contact = lazy(() => import("../pages/website/Contact/Contact"));
const Faq = lazy(() => import("../pages/website/Faq/Faq"));
const SocialVideos = lazy(() => import("../pages/website/SocialVideos/SocialVideos"));
const PrivacyPolicy = lazy(() => import("../pages/website/Privacy/PrivacyPolicy"));
const TermsConditions = lazy(() => import("../pages/website/Terms/TermsConditions"));
const Cart = lazy(() => import("../pages/website/Cart/Cart"));
const Wishlist = lazy(() => import("../pages/website/Wishlist/Wishlist"));
const Checkout = lazy(() => import("../pages/website/Checkout/Checkout"));
const OrderTracking = lazy(() => import("../pages/website/Tracking/OrderTracking"));
const Auth = lazy(() => import("../pages/website/Auth/Auth"));
const Profile = lazy(() => import("../pages/website/Profile/Profile"));
const NotFound = lazy(() => import("../pages/website/NotFound"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <WebsiteLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "shop", element: <Shop /> },
      { path: "contact", element: <Contact /> },
      { path: "faq", element: <Faq /> },
      { path: "Community", element: <SocialVideos /> },
      { path: "privacy", element: <PrivacyPolicy /> },
      { path: "terms", element: <TermsConditions /> },
      { path: "cart", element: <Cart /> },
      { path: "wishlist", element: <Wishlist /> },
      { path: "checkout", element: <Checkout /> },
      { path: "track", element: <OrderTracking /> },
      { path: "auth", element: <Auth /> },
      { path: "profile", element: <Profile /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

const AppRoutes = () => <RouterProvider router={router} />;

export default AppRoutes;
