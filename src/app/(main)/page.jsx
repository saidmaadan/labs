import { Hero } from "@/components/home/hero";
import { Features } from "@/components/home/features";
//import { Projects } from "@/components/home/projects";
import { LatestBlogs } from "@/components/home/latest-blogs";
import { FAQ } from "@/components/home/faq";

export const metadata = {
  title: "InventiveLabs - AI Software Development Company",
  description: "Leading AI software development company specializing in custom AI solutions, machine learning, and software engineering.",
};

export default function HomePage() {
  return (
    <main >
      <Hero />
      <Features />
      
      <LatestBlogs />
      <FAQ />
    </main>
  );
}
