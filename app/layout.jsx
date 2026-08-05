import './globals.css';
import { CartProvider } from '@/lib/cartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';

export const metadata = {
  title: 'Downtown Studio — Contemporary Streetwear',
  description: 'Premium clothing brand from Chattogram, Bangladesh. Nationwide delivery.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Header />
          {children}
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
