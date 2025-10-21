import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, User, Clock, Tag, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from 'lucide-react'
import toast from 'react-hot-toast'

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // Mock blog post data - In production, this would come from an API
  const blogPost = {
    id: id,
    title: 'Getting Started with Modern Web Development',
    content: `
      <p>Modern web development has evolved significantly over the past few years. With the introduction of powerful frameworks and tools, building scalable and maintainable applications has become more accessible than ever.</p>
      
      <h2>The Modern Tech Stack</h2>
      <p>Today's web developers have access to an incredible ecosystem of tools and technologies. React has become the de facto standard for building user interfaces, while TypeScript adds type safety and better developer experience.</p>
      
      <h3>Key Technologies</h3>
      <ul>
        <li><strong>React:</strong> A powerful library for building user interfaces with a component-based architecture</li>
        <li><strong>TypeScript:</strong> Adds static typing to JavaScript, catching errors before runtime</li>
        <li><strong>Tailwind CSS:</strong> A utility-first CSS framework for rapid UI development</li>
        <li><strong>Vite:</strong> A next-generation frontend build tool that's incredibly fast</li>
      </ul>
      
      <h2>Best Practices</h2>
      <p>Following best practices is crucial for building maintainable applications. Here are some key principles to keep in mind:</p>
      
      <ol>
        <li>Write clean, readable code</li>
        <li>Follow component composition patterns</li>
        <li>Implement proper error handling</li>
        <li>Use TypeScript for type safety</li>
        <li>Optimize for performance</li>
      </ol>
      
      <h2>Getting Started</h2>
      <p>The best way to learn is by building. Start with small projects and gradually increase complexity. Don't be afraid to experiment and make mistakes - that's how we learn and grow as developers.</p>
      
      <blockquote>
        "The only way to learn a new programming language is by writing programs in it." - Dennis Ritchie
      </blockquote>
      
      <h2>Conclusion</h2>
      <p>Modern web development is an exciting field with endless possibilities. Whether you're just starting or looking to level up your skills, there's always something new to learn. Stay curious, keep building, and enjoy the journey!</p>
    `,
    author: 'John Doe',
    date: '2024-10-15',
    category: 'Development',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200',
    readTime: '5 min read',
    tags: ['React', 'TypeScript', 'Web Development', 'Tutorial'],
  }

  const relatedPosts = [
    {
      id: '2',
      title: 'The Future of Online Education',
      image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400',
      category: 'Education',
    },
    {
      id: '3',
      title: 'Design Principles for Better User Experience',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
      category: 'Design',
    },
    {
      id: '4',
      title: 'Building Scalable Applications',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400',
      category: 'Technology',
    },
  ]

  const handleShare = (platform: string) => {
    toast.success(`Sharing to ${platform}!`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={blogPost.image}
          alt={blogPost.title}
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
                {blogPost.category}
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
            {blogPost.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 pb-6 mb-8 border-b border-gray-200">
            <div className="flex items-center text-gray-600">
              <User className="w-5 h-5 mr-2" />
              <span className="font-medium">{blogPost.author}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Calendar className="w-5 h-5 mr-2" />
              <span>{new Date(blogPost.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="w-5 h-5 mr-2" />
              <span>{blogPost.readTime}</span>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-200">
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

          {/* Article Body */}
          <div
            className="prose prose-lg max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: blogPost.content }}
          />

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-3 pt-8 border-t border-gray-200">
            <Tag className="w-5 h-5 text-gray-500" />
            {blogPost.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      </article>

      {/* Related Posts */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Articles</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {relatedPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/blog/${post.id}`}>
                  <div className="card p-0 overflow-hidden hover:shadow-xl transition-shadow">
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
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 hover:text-primary-600 transition-colors">
                        {post.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
