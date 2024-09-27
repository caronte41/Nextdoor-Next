//React
//Third Party

//Services
//Helpers
//Validations
//Components
import Header from "./header";
import Footer from "./footer";

function MainLayoutWithoutSideBar({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <main className="flex-1 ">{children}</main>
      </div>
      <Footer />
    </div>
  );
}

export default MainLayoutWithoutSideBar;
