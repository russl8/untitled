'use server'

import clientPromise from "@/lib/mongodb";

async function getPosts() {
    const client = await clientPromise;
    if (client) {
        const db = client.db("sample_mflix");
        const allPosts = await db.collection("comments").find({}).toArray();
        console.log(allPosts)
        return allPosts;
    }
    return
}

const Component = async () => {
    const posts = await getPosts();

    return (
        <div>
            {/* <h1>All Posts</h1>
            <ul>
                {posts && posts.map((post) => (
                    <li key={post.name}>{post.name}</li>
                ))}
            </ul> */}
        </div>
    );
}

export default Component;
