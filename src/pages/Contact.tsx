import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  MessageCircle, 
  HelpCircle,
  ChevronRight
} from 'lucide-react'
import toast from 'react-hot-toast'

// Form state type
interface FormState {
  name: string
  email: string
  subject: string
  message: string
}

// Contact information type
interface ContactInfo {
  icon: React.ElementType
  title: string
  details: string[]
  color: string
}

export default function Contact() {
  // Form state
  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Contact information
  const contactInfo: ContactInfo[] = [
    {
      icon: MapPin,
      title: 'Visit Us',
      details: [
        '123 Education Avenue',
        'Tech Park, Suite 101',
        'San Francisco, CA 94105'
      ],
      color: 'text-blue-500 bg-blue-100'
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: [
        '+1 (555) 234-5678',
        '+1 (555) 987-6543'
      ],
      color: 'text-green-500 bg-green-100'
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: [
        'support@learningplatform.com',
        'info@learningplatform.com'
      ],
      color: 'text-purple-500 bg-purple-100'
    },
    {
      icon: Clock,
      title: 'Working Hours',
      details: [
        'Monday - Friday: 9:00 AM - 6:00 PM',
        'Saturday: 10:00 AM - 4:00 PM',
        'Sunday: Closed'
      ],
      color: 'text-amber-500 bg-amber-100'
    }
  ]

  // Common questions
  const commonQuestions = [
    {
      question: 'How do I enroll in a course?',
      answer: 'Browse our courses, select the one you want, and click "Enroll" or "Add to Cart".'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and bank transfers.'
    },
    {
      question: 'Can I get a refund if I\'m not satisfied?',
      answer: 'Yes, we offer a 30-day money-back guarantee on all our courses.'
    },
    {
      question: 'How do I access my courses after purchase?',
      answer: 'Log in to your account and navigate to "My Courses" section.'
    }
  ]

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 }
    }
  }

  // Form handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Form validation
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields')
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address')
      return
    }

    // Simulate form submission
    setIsSubmitting(true)
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Success message
      toast.success('Message sent successfully! We\'ll get back to you soon.')
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      })
    } catch (error) {
      toast.error('Something went wrong. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white pt-16 pb-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              Get in Touch
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-primary-100 max-w-2xl mx-auto"
            >
              We're here to help with any questions about our courses, 
              platform, or anything else you'd like to know.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {contactInfo.map((info, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${info.color}`}>
                  <info.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{info.title}</h3>
                <div className="space-y-1 text-gray-600">
                  {info.details.map((detail, i) => (
                    <p key={i}>{detail}</p>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form Side */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-input w-full rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-input w-full rounded-md"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="form-select w-full rounded-md"
                  >
                    <option value="">Please select</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="courses">Course Information</option>
                    <option value="billing">Billing & Payments</option>
                    <option value="partnership">Partnership Opportunities</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="form-textarea w-full rounded-md"
                    required
                  ></textarea>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>Processing...</>
                    ) : (
                      <>
                        Send Message
                        <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Common Questions Side */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="bg-gray-50 rounded-lg p-8 shadow-sm mb-8">
                <div className="flex items-center mb-6">
                  <div className="bg-primary-100 p-3 rounded-full mr-4">
                    <HelpCircle className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900">Common Questions</h3>
                </div>
                
                <div className="space-y-6">
                  {commonQuestions.map((item, index) => (
                    <div key={index}>
                      <h4 className="font-medium text-gray-900 mb-2 flex items-start">
                        <ChevronRight className="h-5 w-5 text-primary-600 mr-2 flex-shrink-0 mt-0.5" />
                        {item.question}
                      </h4>
                      <p className="text-gray-600 ml-7">{item.answer}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <a href="#" className="text-primary-600 hover:text-primary-700 font-medium flex items-center">
                    View our full FAQ
                    <ChevronRight className="ml-1 h-5 w-5" />
                  </a>
                </div>
              </div>

              <div className="bg-primary-50 rounded-lg p-8 shadow-sm">
                <div className="flex items-center mb-6">
                  <div className="bg-primary-100 p-3 rounded-full mr-4">
                    <MessageCircle className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900">Live Chat Support</h3>
                </div>
                
                <p className="text-gray-700 mb-6">
                  Need immediate assistance? Our support team is available via live chat during business hours.
                </p>
                
                <button className="w-full py-3 px-4 border border-primary-600 text-primary-600 font-medium rounded-lg hover:bg-primary-50 transition-colors flex items-center justify-center">
                  Start Live Chat
                  <ChevronRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Location</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Visit our headquarters in the heart of San Francisco's tech district.
            </p>
          </div>
          
          <div className="h-96 rounded-lg overflow-hidden shadow-md">
            {/* This would be a real map in a production app */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d50470.21613250948!2d-122.43913192089682!3d37.75770431356797!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan%20Francisco%2C%20CA%2C%20USA!5e0!3m2!1sen!2sin!4v1635138707731!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy"
              title="Office Location Map"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Connect Section */}
      <section className="py-16 bg-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">Connect With Us</h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Follow us on social media for the latest updates, educational content, and community stories.
            </p>
            
            <div className="flex justify-center space-x-6">
              {['facebook', 'twitter', 'instagram', 'linkedin', 'youtube'].map((social) => (
                <motion.a
                  key={social}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  href={`https://${social}.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors"
                >
                  <img 
                    src={`/icons/${social}.svg`} 
                    alt={`${social} icon`} 
                    className="w-6 h-6" 
                  />
                </motion.a>
              ))}
            </div>
            
            <p className="mt-8 text-primary-200 text-sm">
              Subscribe to our newsletter for exclusive content and special offers
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}