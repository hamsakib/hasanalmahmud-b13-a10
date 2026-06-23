import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';
import SellerRoute from './SellerRoute';

import Home from '../pages/Home/Home';
import AllProducts from '../pages/Products/AllProducts';
import ProductDetails from '../pages/Products/ProductDetails';
import Categories from '../pages/Categories/Categories';
import CategoryProducts from '../pages/Categories/CategoryProducts';
import AboutUs from '../pages/AboutUs/AboutUs';
import ContactUs from '../pages/ContactUs/ContactUs';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import ErrorPage from '../pages/ErrorPage';

import DashboardHome from '../pages/Dashboard/DashboardHome';

import BuyerOrders from '../pages/Dashboard/Buyer/BuyerOrders';
import BuyerWishlist from '../pages/Dashboard/Buyer/BuyerWishlist';
import BuyerPaymentHistory from '../pages/Dashboard/Buyer/BuyerPaymentHistory';
import BuyerProfile from '../pages/Dashboard/Buyer/BuyerProfile';

import SellerDashboard from '../pages/Dashboard/Seller/SellerDashboard';
import AddProduct from '../pages/Dashboard/Seller/AddProduct';
import MyProducts from '../pages/Dashboard/Seller/MyProducts';
import ManageOrders from '../pages/Dashboard/Seller/ManageOrders';
import SalesAnalytics from '../pages/Dashboard/Seller/SalesAnalytics';

import AdminDashboard from '../pages/Dashboard/Admin/AdminDashboard';
import ManageUsers from '../pages/Dashboard/Admin/ManageUsers';
import AdminProducts from '../pages/Dashboard/Admin/AdminProducts';
import AdminOrders from '../pages/Dashboard/Admin/AdminOrders';
import AdminPayments from '../pages/Dashboard/Admin/AdminPayments';
import PlatformAnalytics from '../pages/Dashboard/Admin/PlatformAnalytics';

import Checkout from '../pages/Payment/Checkout';
import PaymentSuccess from '../pages/Payment/PaymentSuccess';
import CompareProducts from '../pages/Compare/CompareProducts';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: 'products', element: <AllProducts /> },
      { path: 'products/:id', element: <ProductDetails /> },
      { path: 'categories', element: <Categories /> },
      { path: 'categories/:category', element: <CategoryProducts /> },
      { path: 'about', element: <AboutUs /> },
      { path: 'contact', element: <ContactUs /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'compare', element: <PrivateRoute><CompareProducts /></PrivateRoute> },
      {
        path: 'checkout/:orderId',
        element: <PrivateRoute><Checkout /></PrivateRoute>,
      },
      {
        path: 'payment-success',
        element: <PrivateRoute><PaymentSuccess /></PrivateRoute>,
      },
    ],
  },
  {
    path: '/dashboard',
    element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
    children: [
      { index: true, element: <DashboardHome /> },
      { path: 'my-orders', element: <BuyerOrders /> },
      { path: 'wishlist', element: <BuyerWishlist /> },
      { path: 'payment-history', element: <BuyerPaymentHistory /> },
      { path: 'profile', element: <BuyerProfile /> },
      { path: 'seller', element: <SellerRoute><SellerDashboard /></SellerRoute> },
      { path: 'add-product', element: <SellerRoute><AddProduct /></SellerRoute> },
      { path: 'my-products', element: <SellerRoute><MyProducts /></SellerRoute> },
      { path: 'manage-orders', element: <SellerRoute><ManageOrders /></SellerRoute> },
      { path: 'sales-analytics', element: <SellerRoute><SalesAnalytics /></SellerRoute> },
      { path: 'admin', element: <AdminRoute><AdminDashboard /></AdminRoute> },
      { path: 'manage-users', element: <AdminRoute><ManageUsers /></AdminRoute> },
      { path: 'admin-products', element: <AdminRoute><AdminProducts /></AdminRoute> },
      { path: 'admin-orders', element: <AdminRoute><AdminOrders /></AdminRoute> },
      { path: 'admin-payments', element: <AdminRoute><AdminPayments /></AdminRoute> },
      { path: 'platform-analytics', element: <AdminRoute><PlatformAnalytics /></AdminRoute> },
    ],
  },
]);

export default router;
