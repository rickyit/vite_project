import { Toaster } from "@/components/ui/toaster";
import Header from "./Header";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <div className="p-4 max-w-[1140px] mx-auto">{children}</div>
      <Toaster />
    </>
  );
};

export default Layout;
