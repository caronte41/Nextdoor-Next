//React
//Third Party

//Services
//Helpers
//Validations
//Components
import Header from "./header";
import Footer from "./footer";
import Sidebar from "./sidebar";

function MainLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 pl-64">{children}</main>
      </div>
      <Footer />
    </div>
  );
}

export default MainLayout;
