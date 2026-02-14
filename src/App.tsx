import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { ResetPassword } from "./pages/ResetPassword";
import { Shop } from "./pages/client/Shop";
import { Product } from "./pages/client/Product";
import { Cart } from "./pages/client/Cart";
import { Profile } from "./pages/Profile";
import { ProfileWallet } from "./pages/ProfileWallet";
import { CosmosPay } from "./pages/CosmosPay";
import { CosmosFounding } from "./pages/CosmosFounding";
import { RetailerDashboard } from "./pages/retailer/RetailerDashboard";
import { RetailerProducts } from "./pages/retailer/RetailerProducts";
import { RetailerSuppliers } from "./pages/retailer/RetailerSuppliers";
import { RetailerStores } from "./pages/retailer/RetailerStores";
import { ProveedoresDashboard } from "./pages/proveedores/ProveedoresDashboard";
import { ProveedoresProductos } from "./pages/proveedores/ProveedoresProductos";
import { ProveedoresPerfil } from "./pages/proveedores/ProveedoresPerfil";
import { ProveedoresRetailers } from "./pages/proveedores/ProveedoresRetailers";
import { ProveedoresVentas } from "./pages/proveedores/ProveedoresVentas";

function CheckoutPlaceholder() {
  return (
    <div className="py-16 px-6 text-center bg-cosmos-bg">
      <h1 className="font-display text-2xl text-cosmos-text mb-4">Checkout</h1>
      <p className="text-cosmos-muted">Procesador de pagos (por integrar con Cosmos Pay y backend).</p>
    </div>
  );
}

function ComoFuncionaPlaceholder() {
  return (
    <div className="py-16 px-6 text-center max-w-[720px] mx-auto bg-cosmos-bg">
      <h1 className="font-display text-2xl text-cosmos-text mb-4">Cómo funciona</h1>
      <p className="text-cosmos-muted">Flujo de protección y transacciones (contenido por definir).</p>
    </div>
  );
}

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
          <Route path="checkout" element={<CheckoutPlaceholder />} />
          <Route path="como-funciona" element={<ComoFuncionaPlaceholder />} />
          <Route path="vender" element={<ComoFuncionaPlaceholder />} />
          <Route path="cosmos-pay" element={<CosmosPay />} />
          <Route path="cosmos-founding" element={<CosmosFounding />} />
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
          <Route path="perfil" element={<Profile />} />
          <Route path="perfil/wallet" element={<ProfileWallet />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
