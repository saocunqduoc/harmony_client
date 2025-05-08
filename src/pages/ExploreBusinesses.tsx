import { Helmet } from "react-helmet";
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { BusinessList } from "../components/business/BusinessList";

const ExploreBusinesses = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Khám phá doanh nghiệp - Harmony Scheduling</title>
      </Helmet>
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto py-8 px-4">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Khám phá doanh nghiệp</h1>
            <p className="text-gray-600">Tìm kiếm doanh nghiệp để đặt lịch dịch vụ</p>
          </div>
          
          <BusinessList />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ExploreBusinesses;