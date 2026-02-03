import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import Footer from "~/components/footer";
import Navbar from "~/components/navbar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { axiosInstance } from "~/lib/axios";
import type { Route } from "./+types/blog";
import type { Blog } from "types/blog";

export default function Blog({ params }: Route.ComponentProps) {
  const { data: blog, isPending } = useQuery({
    queryKey: ["blog", params.objectId],
    queryFn: async () => {
      const { data } = await axiosInstance<Blog>(
        `/api/data/Blogs/${params.objectId}`,
      );
      return data;
    },
  });
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isPending) {
    return (
      <div className="h-screen flex justify-center items-center">
        <p className="text-2xl font-bold">Loading...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Blog Not Found
            </h1>
            <p className="text-muted-foreground mb-6">
              The blog you're looking for doesn't exist.
            </p>
            <Link to="/">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Hero Image */}
        <div className="w-full h-64 md:h-96 overflow-hidden">
          <img
            src={blog.thumbnail}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          {/* Back Button */}
          <Link to="/">
            <Button variant="ghost" size="sm" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blogs
            </Button>
          </Link>

          {/* Category Badge */}
          <Badge variant="secondary" className="mb-4">
            {blog.category}
          </Badge>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {blog.title}
          </h1>

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-muted-foreground mb-8 pb-8 border-b">
            <span className="font-medium">{blog.author}</span>
            <span>•</span>
            <span>{formatDate(blog.created)}</span>
          </div>

          {/* Description */}
          <p className="text-lg text-muted-foreground mb-6 italic">
            {blog.description}
          </p>

          {/* Content */}
          <div className="prose prose-neutral max-w-none">
            {blog.content.split("\n\n").map((paragraph, index) => (
              <p key={index} className="text-foreground mb-4 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
