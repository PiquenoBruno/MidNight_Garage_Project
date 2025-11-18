import { Dashboard } from '../components/dashBoard';
import Footer from '../components/footer';
import HeaderAdmin from '../components/headerAdmin';
import Sidebar from '../components/adminMenu';

export default function AdminDashboard() {
  return (
    <div className="bg-background bg-no-repeat bg-cover text-text-color font-sans min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64">
        <HeaderAdmin />
        <main className="pt-20 p-6">
          <Dashboard />
        </main>
        <Footer />
      </div>
    </div>
  );
}
