import { useCallback, useState } from 'react';
import { Post, PostService } from 'tato_ap-sdk';

export default function usePosts() {
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingToggle, setLoadingToggle] = useState(false);
  const [posts, setPosts] = useState<Post.Paginated>();

  const fetchUserPosts = useCallback(async (userId: number, page = 0) => {
    setLoadingFetch(true);
    try {
      const posts = await PostService.getAllPosts({
        editorId: userId,
        showAll: true,
        page,
        size: 10,
      });
      setPosts(posts);
    } finally {
      setLoadingFetch(false);
    }
  }, []);

  const togglePostStatus = useCallback(async (post: Post.Summary | Post.Detailed) => {
    setLoadingToggle(true);
    try {
      post.published
        ? await PostService.unpublishExistingPost(post.id)
        : await PostService.publishExistingPost(post.id);
    } finally {
      setLoadingToggle(false);
    }
  }, []);

  return {
    fetchUserPosts,
    posts,
    togglePostStatus,
    loadingFetch,
    loadingToggle,
  };
}
