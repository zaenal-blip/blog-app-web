import { Link } from "react-router";
import type { Blog } from "types/blog";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { formatDate } from "~/utils/formatter";



interface BlogCardProps {
  blog: Blog;
}

const BlogCard = ({ blog }: BlogCardProps) => {

  return (
    <Link to={`/blogs/${blog.slug}`}>
      <Card className="h-full overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
        <div className="aspect-video overflow-hidden">
          <img
            src={blog.thumbnail}
            alt={blog.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
        <CardContent className="p-4">
          {/* <Badge variant="secondary" className="mb-2">
            {blog.category}
          </Badge> */}
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-foreground">
            {blog.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {blog.description}
          </p>
        </CardContent>
        <CardFooter className="px-4 pb-4 pt-0">
          <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
            <span>{blog.user?.name ?? blog.userId}</span>
            <span>{formatDate(blog.createdAt)}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default BlogCard;