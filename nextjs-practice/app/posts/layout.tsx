import MainPageLayout from '@/components/MainPageLayout/MainPageLayout';
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";

export default async function PostsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <MainPageLayout>
        {children}
      </MainPageLayout>
      <Footer />
    </>
  );
}
