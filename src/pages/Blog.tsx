import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Calendar, User, ArrowRight, Clock } from 'lucide-react'
import { BlogService } from '../services/blogService'
import { useAsync, usePagination } from '../hooks/useLoading'
import { Blog } from '../types/api'
import { PageLoading } from '../components/ui/Loading'
import { BlogsEmptyState, SearchEmptyState } from '../components/ui/EmptyState'
import { handleDataLoadError, retryOperation } from '../utils/errorHandling'

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Pagination
  const { 
    page, 
    perPage, 
    total, 
    totalPages, 
    hasNextPage, 
    hasPrevPage,
    nextPage,
    prevPage,
    setTotal,
    setIsLoading: setPaginationLoading 
  } = usePagination(1, 9)

  // Async hooks for data fetching
  const { execute: fetchBlogs, isLoading: blogsLoading } = useAsync(BlogService.getBlogs)
  const { execute: fetchCategories, isLoading: categoriesLoading } = useAsync(BlogService.getBlogCategories)

  useEffect(() => {
    loadBlogs()
  }, [page, selectedCategory, searchTerm])

  useEffect(() => {
    loadCategories()
  }, [])

  const loadBlogs = async () => {
    try {
      setPaginationLoading(true)
      const filters = {
        page,
        per_page: perPage,
        search: searchTerm || undefined,
        category_id: selectedCategory !== 'all' ? selectedCategory : undefined,
        is_published: true,
        sort_by: 'created_at' as const,
        sort_order: 'desc' as const
      }
      
      const response = await retryOperation(() => fetchBlogs(filters))
      if (response && response.items) {
        setBlogs(response.items)
        setTotal(response.total)
      } else {
        // No blogs found - this is normal, not an error
        setBlogs([])
        setTotal(0)
      }
    } catch (error) {
      // Handle error gracefully - log but don't show toast for data loading
      handleDataLoadError(error, 'Blogs Loading')
      setBlogs([]) // Ensure empty state is shown
      setTotal(0)
    } finally {
      setPaginationLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const categoriesData = await retryOperation(() => fetchCategories())
      if (categoriesData && categoriesData.length > 0) {
        setCategories(categoriesData)
      } else {
        // No categories found - this is normal, not an error
        setCategories([])
      }
    } catch (error) {
      // Handle error gracefully - log but don't show toast for data loading
      handleDataLoadError(error, 'Blog Categories Loading')
      setCategories([]) // Ensure empty state is handled
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search will be triggered by useEffect when searchTerm changes
  }

  const isLoading = blogsLoading || categoriesLoading

  if (isLoading && blogs.length === 0) {
    return <PageLoading />
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-gray-900 mb-4"
            >
              Our Blog
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600 mb-8"
            >
              Insights, tutorials, and stories from our learning community
            </motion.p>

            {/* Search Bar */}
            <motion.form
              onSubmit={handleSearch}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-md mx-auto"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </motion.form>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-primary-100 text-primary-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  All Articles
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-primary-100 text-primary-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Blog Grid */}
          <div className="flex-1">
            {blogsLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="animate-pulse">
                      <div className="h-48 bg-gray-200"></div>
                      <div className="p-6 space-y-3">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : blogs.length === 0 ? (
              searchTerm ? (
                <SearchEmptyState 
                  query={searchTerm}
                  onClear={() => setSearchTerm('')}
                />
              ) : (
                <BlogsEmptyState onRetry={loadBlogs} />
              )
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {blogs.map((blog, index) => (
                    <motion.article
                      key={blog.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group"
                    >
                      <div className="relative">
                        <img
                          src={blog.featured_image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600'}
                          alt={blog.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="px-2 py-1 bg-primary-600 text-white text-xs font-medium rounded">
                            {blog.category_name || 'Article'}
                          </span>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <User className="w-4 h-4 mr-1" />
                          <span>{blog.author_name || 'Admin'}</span>
                          <Calendar className="w-4 h-4 ml-4 mr-1" />
                          <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                        </div>

                        <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                          {blog.title}
                        </h2>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {blog.excerpt}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{Math.ceil(blog.content?.length / 1000) || 5} min read</span>
                          </div>

                          <Link
                            to={`/blog/${blog.slug || blog.id}`}
                            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors"
                          >
                            Read More
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Link>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Showing {((page - 1) * perPage) + 1} to {Math.min(page * perPage, total)} of {total} articles
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={prevPage}
                        disabled={!hasPrevPage}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>

                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const pageNum = page <= 3 ? i + 1 : page - 2 + i
                          if (pageNum <= totalPages) {
                            return (
                              <button
                                key={pageNum}
                                onClick={() => {/* TODO: Add page navigation */}}
                                className={`px-3 py-2 rounded-md text-sm ${
                                  pageNum === page
                                    ? 'bg-primary-600 text-white'
                                    : 'border border-gray-300 hover:bg-gray-50'
                                }`}
                              >
                                {pageNum}
                              </button>
                            )
                          }
                          return null
                        })}
                      </div>

                      <button
                        onClick={nextPage}
                        disabled={!hasNextPage}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}