import { z } from 'zod';
import { useEffect, useState } from 'react';

const postSchema = z.object({
    userId: z.number().positive().int(),
    id: z.number().positive().int(),
    title: z.string(),
    body : z.string(),
});

const postSchemaArray = z.array(postSchema); // schema for an array of posts

type Posts = z.infer<typeof postSchemaArray>; // type of the posts

const ZodApi = () => {
    const [posts, setPosts] = useState<Posts>([]); // State to store validated posts
    const [error, setError] = useState(""); // State to store any errors

     useEffect(() => {
        fetch("https://jsonplaceholder.typicode.com/posts")
          .then((response) => response.json())
          .then((posts: Posts) => {
               const validatedPosts = postSchemaArray.safeParse(posts);

               if (validatedPosts.success === false) {
                   console.log("Validation Error:",validatedPosts.error);
                   setError(validatedPosts.error.message); // Set error state
                   return;
               }

               // we can now safely use the posts
               console.log(validatedPosts.data);
               setPosts(validatedPosts.data)
          });
     }, []);

    // Handle loading state (optional)
    if (!posts.length && !error) {
        return <div>Loading posts...</div>
    }

    // Handle error state
    if (error) {
          return <div>Error fetching Data</div>; // Display user-friendly error message
    }

     return (
        <div>
            <h1>Posts</h1>
            <ol>
                {posts.map((post) => (
                    <li key={post.id}>
                         {post.title}
                    </li>
                ))}
            </ol>
        </div>
     );
};

export default ZodApi;

