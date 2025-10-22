import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, User, Clock, ArrowLeft, Share2, Facebook, Twitter, Linkedin, MessageCircle } from 'lucide-react'
import { BlogService } from '../services/blogService'
import { useAsync } from '../hooks/useLoading'
import { Blog } from '../types/api'
import { PageLoading } from '../components/ui/Loading'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

interface BlogComment {
  id: string;
  content: string;
  author_name: string;
  created_at: string;
}

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [blog, setBlog] = useState<Blog | null>(null)
  const [comments, setComments] = useState<BlogComment[]>([])
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([])
  const [commentForm, setCommentForm] = useState({ content: '' })
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)

  // Async hooks
  const { execute: fetchBlog, isLoading: blogLoading } = useAsync(BlogService.getBlogBySlug)
  const { execute: fetchComments } = useAsync(BlogService.getBlogComments)
  const { execute: fetchRelatedBlogs } = useAsync(BlogService.getBlogs)

  useEffect(() => {
    if (id) {
      loadBlog()
      loadComments()
    }
  }, [id])

  const loadBlog = async () => {
    if (!id) return
    
    try {
      const blogData = await fetchBlog(id)
      if (blogData) {
        setBlog(blogData)
        // Load related blogs from the same category
        if (blogData.category_id) {
          loadRelatedBlogs(blogData.category_id, blogData.id)
        }
      }
    } catch (error) {
      toast.error('Failed to load blog post')
      console.error('Error loading blog:', error)
      navigate('/blog')
    }
  }

  const loadComments = async () => {
    if (!id) return
    
    try {
      const commentsData = await fetchComments(id)
      if (commentsData?.items) {
        setComments(commentsData.items)
      }
    } catch (error) {
      console.error('Error loading comments:', error)
    }
  }

  const loadRelatedBlogs = async (categoryId: string, excludeId: string) => {
    try {
      const response = await fetchRelatedBlogs({
        category_id: categoryId,
        is_published: true,
        per_page: 3
      })
      if (response?.items) {
        // Filter out current blog from related blogs
        const filtered = response.items.filter(item => item.id !== excludeId)
        setRelatedBlogs(filtered.slice(0, 3))
      }
    } catch (error) {
      console.error('Error loading related blogs:', error)
    }
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!blog || !commentForm.content.trim()) return

    if (!user) {
      toast.error('Please login to comment')
      return
    }

    setIsSubmittingComment(true)
    try {
      await BlogService.addBlogComment(blog.id, { content: commentForm.content })
      setCommentForm({ content: '' })
      toast.success('Comment added successfully!')
      
      // Reload comments
      loadComments()
    } catch (error) {
      toast.error('Failed to add comment')
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const handleShare = (platform: string) => {
    if (!blog) return

    const url = window.location.href
    const text = blog.title

    let shareUrl = ''
    switch (platform) {
      case 'Facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        break
      case 'Twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
        break
      case 'LinkedIn':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        break
      default:
        navigator.clipboard.writeText(url)
        toast.success('Link copied to clipboard!')
        return
    }

    window.open(shareUrl, '_blank', 'width=600,height=400')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length
    return Math.ceil(wordCount / wordsPerMinute)
  }

  if (blogLoading || !blog) {
    return <PageLoading />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={blog.featured_image || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200'}
          alt={blog.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <button
                onClick={() => navigate('/blog')}
                className="flex items-center text-white mb-4 hover:text-primary-300 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Blog
              </button>
              <span className="inline-block bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium mb-4">
                {blog.category_name}
              </span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {blog.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 pb-6 mb-8 border-b border-gray-200">
            <div className="flex items-center text-gray-600">
              <User className="w-5 h-5 mr-2" />
              <span className="font-medium">{blog.author_name}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Calendar className="w-5 h-5 mr-2" />
              <span>{formatDate(blog.created_at)}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="w-5 h-5 mr-2" />
              <span>{calculateReadTime(blog.content)} min read</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-200">
            <div className="flex items-center gap-2 text-gray-600">
              <MessageCircle className="w-5 h-5" />
              <span>{comments.length} comments</span>
            </div>

            {/* Share Buttons */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Share:</span>
              <button
                onClick={() => handleShare('Facebook')}
                className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleShare('Twitter')}
                className="w-10 h-10 bg-sky-500 text-white rounded-lg flex items-center justify-center hover:bg-sky-600 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleShare('LinkedIn')}
                className="w-10 h-10 bg-blue-700 text-white rounded-lg flex items-center justify-center hover:bg-blue-800 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleShare('Link')}
                className="w-10 h-10 bg-gray-600 text-white rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Article Body */}
          <div
            className="prose prose-lg max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </motion.div>

        {/* Comments Section */}
        <section className="mt-16 pt-8 border-t border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Comments ({comments.length})</h3>

          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <div className="mb-4">
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                Add a comment
              </label>
              <textarea
                id="comment"
                rows={4}
                value={commentForm.content}
                onChange={(e) => setCommentForm(prev => ({ ...prev, content: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Share your thoughts..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingComment || !user}
              className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmittingComment ? 'Posting...' : user ? 'Post Comment' : 'Login to Comment'}
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{comment.author_name}</h4>
                      <p className="text-sm text-gray-500">{formatDate(comment.created_at)}</p>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            ))}
          </div>
        </section>
      </article>

      {/* Related Posts */}
      {relatedBlogs.length > 0 && (
        <section className="bg-white py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedBlogs.map((relatedBlog, index) => (
                <motion.div
                  key={relatedBlog.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/blog/${relatedBlog.slug || relatedBlog.id}`}>
                    <div className="card p-0 overflow-hidden hover:shadow-xl transition-shadow">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={relatedBlog.featured_image || 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400'}
                          alt={relatedBlog.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                            {relatedBlog.category_name}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-gray-900 hover:text-primary-600 transition-colors">
                          {relatedBlog.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}