import BlogHeader from "@/components/blog/BlogHeader";
import SubscribeFooter from "@/components/blog/SubscribeFooter";

export type BlogLayoutProps = { children: React.ReactNode };

export default async function BlogLayout({ children }: BlogLayoutProps) {
  return (
    <div className="post">
      <div className="mx-auto my-8 max-w-xl px-6 lg:max-w-2xl">
        <BlogHeader />
        {children}
        <SubscribeFooter />
        <p className="text-center text-xs text-stone-400">
          <br />
          Vinícius Pereira. 2026.
          <br />
          www.viniciusofp.com.br
        </p>
      </div>
    </div>
  );
}
