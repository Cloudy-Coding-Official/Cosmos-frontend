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

function CheckoutPlaceholder() {
  return (
    <div className="py-16 px-6 text-center bg-cosmos-bg">
      <h1 className="font-display text-2xl text-cosmos-text mb-4">Checkout</h1>
      <p className="text-cosmos-muted">Procesador de pagos (por integrar con backend).</p>
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
          <Route path="proveedores" element={<ComoFuncionaPlaceholder />} />
          <Route path="perfil" element={<Profile />} />
          <Route path="perfil/wallet" element={<ProfileWallet />} />
          <Route path="retailer" element={<div className="py-16 px-6 text-center bg-cosmos-bg"><h1 className="font-display text-2xl text-cosmos-text">Mi tienda (Retailer)</h1></div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
