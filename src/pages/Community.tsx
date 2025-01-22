import React, { useState, useEffect } from 'react';
import { MessageSquare, ThumbsUp, Trash } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Markdown from "react-markdown";
import { db } from '../services/firebase'  // Ensure the correct path
import { collection, addDoc, updateDoc, doc, deleteDoc, onSnapshot } from "firebase/firestore";

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

interface Post {
  id: string;
  author: string;
  avatar: string;
  content: string;
  likes: number;
  likedBy: string[];
  comments: Comment[];
  timestamp: string;
}

export default function Community() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [commentInput, setCommentInput] = useState<{ [key: string]: string }>({});
  const [showCommentBox, setShowCommentBox] = useState<{ [key: string]: boolean }>({});

  // Fetch posts from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "posts"), (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
      setPosts(postsData);
    });
    return () => unsubscribe();
  }, []);

  // Add a new post
  const addPost = async () => {
    if (newPost.trim()) {
      await addDoc(collection(db, "posts"), {
        author: "You",
        avatar: "https://via.placeholder.com/40",
        content: newPost,
        likes: 0,
        likedBy: [],
        comments: [],
        timestamp: new Date().toISOString(),
      });
      setNewPost("");
    }
  };

  // Delete a post
  const deletePost = async (postId: string) => {
    await deleteDoc(doc(db, "posts", postId));
  };

  // Like or unlike a post
  const likePost = async (postId: string) => {
    const postRef = doc(db, "posts", postId);
    const post = posts.find((p) => p.id === postId);
    if (post) {
      const likedBy = post.likedBy.includes("You")
        ? post.likedBy.filter((user) => user !== "You")
        : [...post.likedBy, "You"];
      await updateDoc(postRef, { likes: likedBy.length, likedBy });
    }
  };

  // Add a comment to a post
  const addComment = async (postId: string) => {
    if (commentInput[postId]?.trim()) {
      const postRef = doc(db, "posts", postId);
      const post = posts.find((p) => p.id === postId);
      if (post) {
        const newComment = {
          id: Date.now().toString(),
          author: "You",
          content: commentInput[postId],
          timestamp: new Date().toISOString(),
        };
        await updateDoc(postRef, { comments: [...post.comments, newComment] });
      }
      setCommentInput((prev) => ({ ...prev, [postId]: "" }));
      setShowCommentBox((prev) => ({ ...prev, [postId]: false }));
    }
  };

  // Delete a comment
  const deleteComment = async (postId: string, commentId: string) => {
    const postRef = doc(db, "posts", postId);
    const post = posts.find((p) => p.id === postId);
    if (post) {
      const updatedComments = post.comments.filter((comment) => comment.id !== commentId);
      await updateDoc(postRef, { comments: updatedComments });
    }
  };

  // Sort posts
  const sortedPosts = [...posts].sort((a, b) => {
    if (sortOption === "newest") return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    if (sortOption === "mostLiked") return b.likes - a.likes;
    if (sortOption === "mostCommented") return b.comments.length - a.comments.length;
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-100 text-black">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold">Welcome to the Community Page!</h2>
        <p className="text-gray-700 mt-2">Connect, share, and grow with our supportive healthcare community:</p>
      </div>

      {/* Sorting Options */}
      <select onChange={(e) => setSortOption(e.target.value)} className="mb-4">
        <option value="newest">Newest</option>
        <option value="mostLiked">Most Liked</option>
        <option value="mostCommented">Most Commented</option>
      </select>

      {/* Add New Post */}
      <div className="mb-6">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Share your thoughts or ask a question..."
          className="w-full border rounded-lg p-4 h-32"
        />
        <button onClick={addPost} className="bg-indigo-600 text-white px-4 py-2 rounded-md mt-2">Post</button>
      </div>

      {/* Display Posts */}
      <div className="space-y-6">
        {sortedPosts.map((post) => (
          <div key={post.id} className="bg-white shadow rounded-lg p-6">
            <Markdown className="mt-4">{post.content}</Markdown>
            <div className="mt-4 flex items-center space-x-4">
              <button onClick={() => likePost(post.id)} className="flex items-center text-gray-500 hover:text-indigo-600">
                <ThumbsUp className="w-5 h-5 mr-1" /> {post.likes}
              </button>
              <button
                onClick={() => setShowCommentBox((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}
                className="flex items-center text-gray-500 hover:text-indigo-600"
              >
                <MessageSquare className="w-5 h-5 mr-1" /> {post.comments.length}
              </button>
              <button onClick={() => deletePost(post.id)} className="flex items-center text-red-500 hover:text-red-700">
                <Trash className="w-5 h-5 mr-1" /> Delete
              </button>
            </div>

            {/* Add Comment Box */}
            {showCommentBox[post.id] && (
              <div className="mt-4">
                <textarea
                  value={commentInput[post.id] || ""}
                  onChange={(e) => setCommentInput((prev) => ({ ...prev, [post.id]: e.target.value }))}
                  className="w-full border rounded-lg p-2"
                />
                <button onClick={() => addComment(post.id)} className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2">
                  Comment
                </button>
              </div>
            )}

            {/* Display Comments */}
            {post.comments.map((comment) => (
              <div key={comment.id} className="mt-2 text-gray-700 border p-2 rounded-md flex justify-between">
                <span>{comment.author}: {comment.content}</span>
                <button
                  onClick={() => deleteComment(post.id, comment.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
