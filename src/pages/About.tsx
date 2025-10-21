import { motion } from 'framer-motion'
import { 
  Globe, 
  Users, 
  Award, 
  Lightbulb, 
  CheckCircle, 
  ChevronRight,
  GraduationCap
} from 'lucide-react'
import { Link } from 'react-router-dom'

// Team member type definition
interface TeamMember {
  name: string
  role: string
  bio: string
  image: string
}

export default function About() {
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  }

  // Sample stats
  const stats = [
    { value: '15K+', label: 'Students', icon: Users },
    { value: '150+', label: 'Courses', icon: GraduationCap },
    { value: '25+', label: 'Expert Instructors', icon: Award },
    { value: '12', label: 'Countries Served', icon: Globe },
  ]

  // Core values
  const coreValues = [
    {
      title: 'Educational Excellence',
      description: 'We strive for the highest standards in teaching and learning materials.',
      icon: Award
    },
    {
      title: 'Innovation & Creativity',
      description: 'We encourage new ideas and creative approaches to problem-solving.',
      icon: Lightbulb
    },
    {
      title: 'Inclusivity & Diversity',
      description: 'We create inclusive learning environments where all students can thrive.',
      icon: Users
    },
    {
      title: 'Lifelong Learning',
      description: 'We foster a culture of continuous improvement and knowledge acquisition.',
      icon: GraduationCap
    }
  ]

  // Leadership team
  const teamMembers: TeamMember[] = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Founder & CEO',
      bio: 'Former professor with 15+ years in educational technology and a passion for accessible learning.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&auto=format&fit=crop&q=80'
    },
    {
      name: 'Michael Chen',
      role: 'Chief Technology Officer',
      bio: 'Tech innovator with experience at leading companies, focused on creating intuitive learning platforms.',
      image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&auto=format&fit=crop&q=80'
    },
    {
      name: 'Priya Patel',
      role: 'Head of Curriculum',
      bio: 'Curriculum development expert with a background in instructional design and cognitive psychology.',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&auto=format&fit=crop&q=80'
    },
    {
      name: 'James Wilson',
      role: 'Chief Operating Officer',
      bio: 'Operations specialist with experience scaling educational startups globally.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&auto=format&fit=crop&q=80'
    }
  ]

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-gray-900 to-gray-800 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80" 
            alt="Background pattern" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Our Learning Platform</h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Transforming education through technology and innovation since 2020.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700 mb-6">
                Our mission is to provide accessible, high-quality education to learners worldwide. 
                We believe that knowledge should be available to everyone, regardless of their location or background.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                Through our innovative platform, we aim to connect students with expert instructors and 
                comprehensive learning materials that empower them to achieve their goals and transform their lives.
              </p>
              <div className="flex items-center">
                <Link to="/courses" className="btn-primary flex items-center">
                  Explore Our Courses
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -z-10 top-0 left-0 w-72 h-72 bg-primary-100 rounded-full -translate-x-1/3 -translate-y-1/3"></div>
              <div className="absolute -z-10 bottom-0 right-0 w-72 h-72 bg-indigo-100 rounded-full translate-x-1/3 translate-y-1/3"></div>
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600" 
                alt="Students learning" 
                className="rounded-lg shadow-xl w-full relative z-10"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="bg-white p-6 rounded-xl shadow-sm text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-full mb-4">
                  <stat.icon className="h-6 w-6" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              These principles guide everything we do, from course development to student support.
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {coreValues.map((value, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-full mb-4">
                  <value.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Leadership Team</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Passionate educators and industry experts dedicated to transforming online education.
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {teamMembers.map((member, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-60 object-cover object-center"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-primary-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="py-16 bg-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8 items-center"
          >
            <div>
              <h2 className="text-3xl font-bold mb-6">Join Our Learning Community</h2>
              <p className="text-xl text-primary-100 mb-6">
                Start your learning journey today with our expert-led courses and supportive community.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Access to 150+ high-quality courses',
                  'Learn at your own pace, anywhere, anytime',
                  'Connect with industry experts and fellow learners',
                  'Earn certificates to boost your resume'
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-primary-300 mr-3 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center space-x-4">
                <Link to="/register" className="btn-secondary bg-white text-primary-700 hover:bg-gray-100">
                  Sign Up Now
                </Link>
                <Link to="/courses" className="text-white underline hover:text-primary-200">
                  Browse Courses
                </Link>
              </div>
            </div>
            <div className="relative">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-primary-800 rounded-lg p-8 relative z-10"
              >
                <h3 className="text-xl font-semibold mb-4">What Our Students Say</h3>
                <blockquote className="text-primary-100 mb-6">
                  "This platform completely transformed my career. The courses were comprehensive 
                  and engaging, and the skills I learned helped me land my dream job in tech."
                </blockquote>
                <div className="flex items-center">
                  <img 
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&auto=format&fit=crop&q=80" 
                    alt="Student" 
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <p className="font-medium">James Peterson</p>
                    <p className="text-primary-300 text-sm">Software Developer</p>
                  </div>
                </div>
              </motion.div>
              <div className="absolute -z-10 top-0 right-0 w-72 h-72 bg-primary-600 rounded-full translate-x-1/4 -translate-y-1/4"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-700">
              Answers to common questions about our platform and courses.
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            {[
              {
                question: 'How does the learning platform work?',
                answer: 'Our platform offers self-paced online courses with video lectures, interactive quizzes, and practical assignments. You can access course materials anytime, track your progress, and interact with instructors and fellow students.'
              },
              {
                question: 'Do I get a certificate after completing a course?',
                answer: 'Yes, upon successful completion of a course, you\'ll receive a digital certificate that you can add to your resume and share on LinkedIn to showcase your new skills.'
              },
              {
                question: 'How long do I have access to a course after purchase?',
                answer: 'Once you purchase a course, you have lifetime access to its materials, allowing you to revisit the content whenever you need to refresh your knowledge.'
              },
              {
                question: 'Can I switch between devices while learning?',
                answer: 'Absolutely! Our platform is fully responsive, allowing you to seamlessly switch between desktop, tablet, and mobile devices without losing your progress.'
              },
              {
                question: 'What is your refund policy?',
                answer: 'We offer a 30-day money-back guarantee on all our courses. If you\'re not satisfied with your purchase, you can request a full refund within 30 days.'
              }
            ].map((faq, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="bg-gray-50 rounded-lg p-6 shadow-sm"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
}