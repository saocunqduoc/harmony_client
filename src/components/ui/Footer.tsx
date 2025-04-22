
import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-background border-t py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-xl text-primary mb-4">Harmony</h3>
            <p className="text-muted-foreground">
              Nền tảng đặt lịch dịch vụ trực tuyến hàng đầu, giúp kết nối khách hàng với các dịch vụ chất lượng.
            </p>
            <div className="flex space-x-4 mt-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Dịch vụ</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/services" className="text-muted-foreground hover:text-primary">
                  Tất cả dịch vụ
                </Link>
              </li>
              <li>
                <Link to="/services?category=1" className="text-muted-foreground hover:text-primary">
                  Massage
                </Link>
              </li>
              <li>
                <Link to="/services?category=2" className="text-muted-foreground hover:text-primary">
                  Spa
                </Link>
              </li>
              <li>
                <Link to="/services?category=3" className="text-muted-foreground hover:text-primary">
                  Làm đẹp
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Doanh nghiệp</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/businesses" className="text-muted-foreground hover:text-primary">
                  Tất cả cửa hàng
                </Link>
              </li>
              <li>
                <Link to="/register?type=business" className="text-muted-foreground hover:text-primary">
                  Đăng ký doanh nghiệp
                </Link>
              </li>
              <li>
                <Link to="/login?type=business" className="text-muted-foreground hover:text-primary">
                  Đăng nhập cho doanh nghiệp
                </Link>
              </li>
              <li>
                <Link to="/business-dashboard" className="text-muted-foreground hover:text-primary">
                  Quản lý doanh nghiệp
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Hỗ trợ</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-muted-foreground hover:text-primary">
                  Trung tâm trợ giúp
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary">
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-primary">
                  Câu hỏi thường gặp
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-primary">
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-primary">
                  Điều khoản dịch vụ
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Harmony. Đã đăng ký bản quyền.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
