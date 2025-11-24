import { AdminList } from '../components/adminList';
import Footer from '../components/footer';
import HeaderAdmin from '../components/headerAdmin';
import Sidebar from '../components/adminMenu';

export default function PageAdminList() {
  return (
    <div className="bg-background bg-no-repeat bg-cover text-text-color font-sans min-h-screen flex">
      {/* Sidebar fixo na esquerda */}
      <Sidebar />

      {/* Conteúdo principal com margem lateral e espaçamento do header */}
      <div className="flex-1 flex flex-col ml-64">
        <HeaderAdmin />

        <main className="p-6 pt-20">
          <AdminList />
        </main>

        <Footer />
      </div>
    </div>
  );
}
