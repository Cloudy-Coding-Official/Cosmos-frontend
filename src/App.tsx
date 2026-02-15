import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { ResetPassword } from "./pages/ResetPassword";
import { Shop } from "./pages/client/Shop";
import { Product } from "./pages/client/Product";
import { Cart } from "./pages/client/Cart";
import { Checkout } from "./pages/client/Checkout";
import { CheckoutSuccess } from "./pages/client/CheckoutSuccess";
import { Profile } from "./pages/Profile";
import { ProfileWallet } from "./pages/ProfileWallet";
import { RetailerDashboard } from "./pages/retailer/RetailerDashboard";
import { RetailerProducts } from "./pages/retailer/RetailerProducts";
import { RetailerSuppliers } from "./pages/retailer/RetailerSuppliers";
import { RetailerStores } from "./pages/retailer/RetailerStores";
import { RetailerVentas } from "./pages/retailer/RetailerVentas";
import { ProveedoresDashboard } from "./pages/proveedores/ProveedoresDashboard";
import { ProveedoresProductos } from "./pages/proveedores/ProveedoresProductos";
import { ProveedoresPerfil } from "./pages/proveedores/ProveedoresPerfil";
import { ProveedoresRetailers } from "./pages/proveedores/ProveedoresRetailers";
import { ProveedoresVentas } from "./pages/proveedores/ProveedoresVentas";
import { Vender } from "./pages/Vender";
import { VenderSinStock } from "./pages/VenderSinStock";
import { ComoFunciona } from "./pages/ComoFunciona";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="login" element={<Login />} />
          <Route path="registro" element={<Register />} />
          <Route path="restablecer-contraseña" element={<ResetPassword />} />
          <Route path="tienda" element={<Shop />} />
          <Route path="producto/:id" element={<Product />} />
          <Route path="carrito" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="checkout/exito" element={<CheckoutSuccess />} />
          <Route path="como-funciona" element={<ComoFunciona />} />
          <Route path="vender" element={<Vender />} />
          <Route path="vender/sin-stock" element={<VenderSinStock />} />
          {/* Proveedores */}
          <Route path="proveedores" element={<ProveedoresDashboard />} />
          <Route path="proveedores/productos" element={<ProveedoresProductos />} />
          <Route path="proveedores/perfil" element={<ProveedoresPerfil />} />
          <Route path="proveedores/retailers" element={<ProveedoresRetailers />} />
          <Route path="proveedores/ventas" element={<ProveedoresVentas />} />
          {/* Retailer */}
          <Route path="retailer" element={<RetailerDashboard />} />
          <Route path="retailer/productos" element={<RetailerProducts />} />
          <Route path="retailer/proveedores" element={<RetailerSuppliers />} />
          <Route path="retailer/proveedores/:id" element={<RetailerSuppliers />} />
          <Route path="retailer/tiendas" element={<RetailerStores />} />
          <Route path="retailer/ventas" element={<RetailerVentas />} />
          <Route path="perfil" element={<Profile />} />
          <Route path="perfil/wallet" element={<ProfileWallet />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
