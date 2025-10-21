import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Calendar, User, ArrowRight } from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  date: string
  category: string
  image: string
  readTime: string
  tags: string[]
}

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = ['All', 'Technology', 'Education', 'Design', 'Business', 'Development']

  const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: 'Getting Started with Modern Web Development',
      excerpt: 'Learn the fundamentals of modern web development with React, TypeScript, and Tailwind CSS.',
      content: 'Full content here...',
      author: 'John Doe',
      date: '2024-10-15',
      category: 'Development',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
      readTime: '5 min read',
      tags: ['React', 'TypeScript', 'Web Development'],
    },
    {
      id: '2',
      title: 'The Future of Online Education',
      excerpt: 'Exploring how technology is transforming the way we learn and teach in the digital age.',
      content: 'Full content here...',
      author: 'Jane Smith',
      date: '2024-10-12',
      category: 'Education',
      image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800',
      readTime: '7 min read',
      tags: ['Education', 'Technology', 'E-Learning'],
    },
    {
      id: '3',
      title: 'Design Principles for Better User Experience',
      excerpt: 'Understanding the core principles that make digital products intuitive and enjoyable to use.',
      content: 'Full content here...',
      author: 'Mike Johnson',
      date: '2024-10-10',
      category: 'Design',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
      readTime: '6 min read',
      tags: ['UX', 'Design', 'UI'],
    },
    {
      id: '4',
      title: 'Building Scalable Applications with Cloud Technology',
      excerpt: 'A comprehensive guide to deploying and scaling modern applications in the cloud.',
      content: 'Full content here...',
      author: 'Sarah Williams',
      date: '2024-10-08',
      category: 'Technology',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
      readTime: '8 min read',
      tags: ['Cloud', 'DevOps', 'Scalability'],
    },
    {
      id: '5',
      title: 'Effective Strategies for Remote Team Management',
      excerpt: 'Best practices for leading and managing distributed teams in the modern workplace.',
      content: 'Full content here...',
      author: 'David Brown',
      date: '2024-10-05',
      category: 'Business',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
      readTime: '6 min read',
      tags: ['Management', 'Remote Work', 'Leadership'],
    },
    {
      id: '6',
      title: 'Introduction to Machine Learning for Beginners',
      excerpt: 'Start your journey into artificial intelligence with this beginner-friendly guide.',
      content: 'Full content here...',
      author: 'Emily Davis',
      date: '2024-10-03',
      category: 'Technology',
      image: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800',
      readTime: '10 min read',
      tags: ['AI', 'Machine Learning', 'Python'],
    },
  ]

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold mb-4">Our Blog</h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Insights, tutorials, and stories about education, technology, and innovation
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="max-w-7xl mx-auto px-4 -mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                    selectedCategory === category
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Blog Posts Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">No articles found. Try adjusting your search.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/blog/${post.id}`}>
                  <div className="card p-0 overflow-hidden hover:shadow-xl transition-shadow h-full flex flex-col">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                          {post.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                        <span className="mx-2">•</span>
                        <span>{post.readTime}</span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-primary-600 transition-colors">
                        {post.title}
                      </h3>

                      <p className="text-gray-600 mb-4 flex-1">{post.excerpt}</p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center text-sm text-gray-700">
                          <User className="w-4 h-4 mr-1" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center text-primary-600 font-medium text-sm">
                          Read More
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Newsletter Section */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-gray-600 mb-8">
              Get the latest articles and updates delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
              <button className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
