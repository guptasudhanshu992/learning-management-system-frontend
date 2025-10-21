import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  GripVertical,
  Video,
  FileText,
  HelpCircle,
  Clock,
  Upload,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Lesson {
  id: string
  title: string
  type: 'video' | 'text'
  content: string
  duration?: string
  order: number
}

interface Quiz {
  id: string
  title: string
  questions: Question[]
  passingScore: number
  timeLimit?: number
  isTimedtest: boolean
}

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

interface Chapter {
  id: string
  title: string
  description: string
  lessons: Lesson[]
  quiz?: Quiz
  order: number
  isExpanded: boolean
}

export default function CourseBuilder() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'details' | 'content' | 'pricing'>('details')
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null)

  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'beginner',
    instructor: '',
    thumbnail: '',
    price: 0,
    duration: '',
  })

  const [chapters, setChapters] = useState<Chapter[]>([])

  // Add Chapter
  const addChapter = () => {
    const newChapter: Chapter = {
      id: Date.now().toString(),
      title: 'New Chapter',
      description: '',
      lessons: [],
      order: chapters.length,
      isExpanded: true,
    }
    setChapters([...chapters, newChapter])
    setExpandedChapter(newChapter.id)
  }

  // Update Chapter
  const updateChapter = (id: string, field: string, value: any) => {
    setChapters(
      chapters.map((chapter) =>
        chapter.id === id ? { ...chapter, [field]: value } : chapter
      )
    )
  }

  // Delete Chapter
  const deleteChapter = (id: string) => {
    if (window.confirm('Are you sure you want to delete this chapter?')) {
      setChapters(chapters.filter((chapter) => chapter.id !== id))
      toast.success('Chapter deleted')
    }
  }

  // Add Lesson to Chapter
  const addLesson = (chapterId: string, type: 'video' | 'text') => {
    setChapters(
      chapters.map((chapter) => {
        if (chapter.id === chapterId) {
          const newLesson: Lesson = {
            id: Date.now().toString(),
            title: `New ${type === 'video' ? 'Video' : 'Text'} Lesson`,
            type,
            content: '',
            order: chapter.lessons.length,
          }
          return { ...chapter, lessons: [...chapter.lessons, newLesson] }
        }
        return chapter
      })
    )
  }

  // Update Lesson
  const updateLesson = (chapterId: string, lessonId: string, field: string, value: any) => {
    setChapters(
      chapters.map((chapter) => {
        if (chapter.id === chapterId) {
          return {
            ...chapter,
            lessons: chapter.lessons.map((lesson) =>
              lesson.id === lessonId ? { ...lesson, [field]: value } : lesson
            ),
          }
        }
        return chapter
      })
    )
  }

  // Delete Lesson
  const deleteLesson = (chapterId: string, lessonId: string) => {
    setChapters(
      chapters.map((chapter) => {
        if (chapter.id === chapterId) {
          return {
            ...chapter,
            lessons: chapter.lessons.filter((lesson) => lesson.id !== lessonId),
          }
        }
        return chapter
      })
    )
    toast.success('Lesson deleted')
  }

  // Add Quiz to Chapter
  const addQuiz = (chapterId: string) => {
    setChapters(
      chapters.map((chapter) => {
        if (chapter.id === chapterId) {
          const newQuiz: Quiz = {
            id: Date.now().toString(),
            title: 'Chapter Quiz',
            questions: [],
            passingScore: 70,
            isTimedtest: false,
          }
          return { ...chapter, quiz: newQuiz }
        }
        return chapter
      })
    )
    toast.success('Quiz added')
  }

  // Add Question to Quiz
  const addQuestion = (chapterId: string) => {
    setChapters(
      chapters.map((chapter) => {
        if (chapter.id === chapterId && chapter.quiz) {
          const newQuestion: Question = {
            id: Date.now().toString(),
            question: '',
            options: ['', '', '', ''],
            correctAnswer: 0,
          }
          return {
            ...chapter,
            quiz: {
              ...chapter.quiz,
              questions: [...chapter.quiz.questions, newQuestion],
            },
          }
        }
        return chapter
      })
    )
  }

  // Update Question
  const updateQuestion = (
    chapterId: string,
    questionId: string,
    field: string,
    value: any
  ) => {
    setChapters(
      chapters.map((chapter) => {
        if (chapter.id === chapterId && chapter.quiz) {
          return {
            ...chapter,
            quiz: {
              ...chapter.quiz,
              questions: chapter.quiz.questions.map((q) =>
                q.id === questionId ? { ...q, [field]: value } : q
              ),
            },
          }
        }
        return chapter
      })
    )
  }

  // Update Quiz Settings
  const updateQuiz = (chapterId: string, field: string, value: any) => {
    setChapters(
      chapters.map((chapter) => {
        if (chapter.id === chapterId && chapter.quiz) {
          return {
            ...chapter,
            quiz: {
              ...chapter.quiz,
              [field]: value,
            },
          }
        }
        return chapter
      })
    )
  }

  // Save Course
  const handleSave = (status: 'draft' | 'published') => {
    if (!courseData.title || !courseData.description) {
      toast.error('Please fill in all required course details')
      return
    }

    if (chapters.length === 0) {
      toast.error('Please add at least one chapter')
      return
    }

    // Here you would save to your backend
    console.log('Saving course:', { ...courseData, chapters, status })
    toast.success(`Course ${status === 'published' ? 'published' : 'saved as draft'} successfully!`)
    navigate('/admin/courses')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/courses')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Course Builder</h1>
            <p className="text-gray-600 mt-1">Create your course structure</p>
          </div>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSave('draft')}
            className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Save as Draft
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSave('published')}
            className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            <Save className="w-5 h-5 mr-2" />
            Publish Course
          </motion.button>
        </div>
      </div>

      {/* Tabs */}
      <div className="card p-0 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('details')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'details'
                ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Course Details
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'content'
                ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Content & Curriculum
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'pricing'
                ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Pricing & Publishing
          </button>
        </div>

        {/* Course Details Tab */}
        {activeTab === 'details' && (
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Title *
              </label>
              <input
                type="text"
                value={courseData.title}
                onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
                className="input-field"
                placeholder="e.g., Complete Web Development Bootcamp"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Description *
              </label>
              <textarea
                value={courseData.description}
                onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
                className="input-field min-h-[120px]"
                placeholder="Describe what students will learn in this course..."
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={courseData.category}
                  onChange={(e) => setCourseData({ ...courseData, category: e.target.value })}
                  className="input-field"
                >
                  <option value="">Select category</option>
                  <option value="Development">Development</option>
                  <option value="Design">Design</option>
                  <option value="Business">Business</option>
                  <option value="Marketing">Marketing</option>
                  <option value="IT & Software">IT & Software</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Level *
                </label>
                <select
                  value={courseData.level}
                  onChange={(e) => setCourseData({ ...courseData, level: e.target.value })}
                  className="input-field"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instructor Name *
                </label>
                <input
                  type="text"
                  value={courseData.instructor}
                  onChange={(e) => setCourseData({ ...courseData, instructor: e.target.value })}
                  className="input-field"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration
                </label>
                <input
                  type="text"
                  value={courseData.duration}
                  onChange={(e) => setCourseData({ ...courseData, duration: e.target.value })}
                  className="input-field"
                  placeholder="e.g., 8 weeks"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thumbnail URL
              </label>
              <div className="flex gap-3">
                <input
                  type="url"
                  value={courseData.thumbnail}
                  onChange={(e) => setCourseData({ ...courseData, thumbnail: e.target.value })}
                  className="input-field"
                  placeholder="https://example.com/thumbnail.jpg"
                />
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </button>
              </div>
              {courseData.thumbnail && (
                <div className="mt-3">
                  <img
                    src={courseData.thumbnail}
                    alt="Thumbnail preview"
                    className="w-full max-w-md h-48 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Build your course curriculum with chapters, lessons, and quizzes
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={addChapter}
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Chapter
              </motion.button>
            </div>

            {/* Chapters List */}
            <div className="space-y-4">
              {chapters.map((chapter, _chapterIndex) => (
                <div key={chapter.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* Chapter Header */}
                  <div className="bg-gray-50 p-4 flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <button className="cursor-move mr-3">
                        <GripVertical className="w-5 h-5 text-gray-400" />
                      </button>
                      <button
                        onClick={() =>
                          setExpandedChapter(
                            expandedChapter === chapter.id ? null : chapter.id
                          )
                        }
                        className="mr-3"
                      >
                        {expandedChapter === chapter.id ? (
                          <ChevronDown className="w-5 h-5 text-gray-600" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-600" />
                        )}
                      </button>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={chapter.title}
                          onChange={(e) =>
                            updateChapter(chapter.id, 'title', e.target.value)
                          }
                          className="font-medium text-gray-900 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-2 py-1 w-full"
                          placeholder="Chapter title"
                        />
                      </div>
                      <span className="text-sm text-gray-500 ml-4">
                        {chapter.lessons.length} lessons
                      </span>
                    </div>
                    <button
                      onClick={() => deleteChapter(chapter.id)}
                      className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Chapter Content */}
                  {expandedChapter === chapter.id && (
                    <div className="p-4 space-y-4 bg-white">
                      <div>
                        <textarea
                          value={chapter.description}
                          onChange={(e) =>
                            updateChapter(chapter.id, 'description', e.target.value)
                          }
                          className="input-field min-h-[80px]"
                          placeholder="Chapter description (optional)"
                        />
                      </div>

                      {/* Lessons */}
                      <div className="space-y-3">
                        {chapter.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center flex-1">
                                {lesson.type === 'video' ? (
                                  <Video className="w-5 h-5 text-blue-600 mr-3" />
                                ) : (
                                  <FileText className="w-5 h-5 text-green-600 mr-3" />
                                )}
                                <input
                                  type="text"
                                  value={lesson.title}
                                  onChange={(e) =>
                                    updateLesson(
                                      chapter.id,
                                      lesson.id,
                                      'title',
                                      e.target.value
                                    )
                                  }
                                  className="flex-1 bg-white border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                  placeholder="Lesson title"
                                />
                              </div>
                              <button
                                onClick={() => deleteLesson(chapter.id, lesson.id)}
                                className="ml-3 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            {lesson.type === 'video' ? (
                              <div className="space-y-3">
                                <input
                                  type="text"
                                  value={lesson.content}
                                  onChange={(e) =>
                                    updateLesson(
                                      chapter.id,
                                      lesson.id,
                                      'content',
                                      e.target.value
                                    )
                                  }
                                  className="input-field"
                                  placeholder="Video URL (YouTube, Vimeo, or direct link)"
                                />
                                <input
                                  type="text"
                                  value={lesson.duration || ''}
                                  onChange={(e) =>
                                    updateLesson(
                                      chapter.id,
                                      lesson.id,
                                      'duration',
                                      e.target.value
                                    )
                                  }
                                  className="input-field"
                                  placeholder="Duration (e.g., 15:30)"
                                />
                              </div>
                            ) : (
                              <textarea
                                value={lesson.content}
                                onChange={(e) =>
                                  updateLesson(
                                    chapter.id,
                                    lesson.id,
                                    'content',
                                    e.target.value
                                  )
                                }
                                className="input-field min-h-[120px]"
                                placeholder="Lesson content (supports Markdown)"
                              />
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Add Lesson Buttons */}
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={() => addLesson(chapter.id, 'video')}
                          className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                        >
                          <Video className="w-4 h-4 mr-2" />
                          Add Video Lesson
                        </button>
                        <button
                          onClick={() => addLesson(chapter.id, 'text')}
                          className="flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Add Text Lesson
                        </button>
                        {!chapter.quiz && (
                          <button
                            onClick={() => addQuiz(chapter.id)}
                            className="flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
                          >
                            <HelpCircle className="w-4 h-4 mr-2" />
                            Add Quiz
                          </button>
                        )}
                      </div>

                      {/* Quiz Section */}
                      {chapter.quiz && (
                        <div className="mt-4 border-t border-gray-200 pt-4">
                          <div className="bg-purple-50 rounded-lg p-4 space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-gray-900 flex items-center">
                                <HelpCircle className="w-5 h-5 text-purple-600 mr-2" />
                                Chapter Quiz
                              </h4>
                              <button
                                onClick={() => updateChapter(chapter.id, 'quiz', undefined)}
                                className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Passing Score (%)
                                </label>
                                <input
                                  type="number"
                                  value={chapter.quiz.passingScore}
                                  onChange={(e) =>
                                    updateQuiz(
                                      chapter.id,
                                      'passingScore',
                                      parseInt(e.target.value)
                                    )
                                  }
                                  className="input-field"
                                  min="0"
                                  max="100"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  Time Limit (minutes)
                                </label>
                                <input
                                  type="number"
                                  value={chapter.quiz.timeLimit || ''}
                                  onChange={(e) =>
                                    updateQuiz(
                                      chapter.id,
                                      'timeLimit',
                                      e.target.value ? parseInt(e.target.value) : undefined
                                    )
                                  }
                                  className="input-field"
                                  placeholder="No limit"
                                />
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={chapter.quiz.isTimedtest}
                                onChange={(e) =>
                                  updateQuiz(chapter.id, 'isTimedtest', e.target.checked)
                                }
                                className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                              />
                              <label className="text-sm text-gray-700">
                                This is a timed test (strict timing)
                              </label>
                            </div>

                            {/* Questions */}
                            <div className="space-y-3 mt-4">
                              {chapter.quiz.questions.map((question, qIndex) => (
                                <div
                                  key={question.id}
                                  className="bg-white rounded-lg p-4 border border-gray-200"
                                >
                                  <div className="flex items-start justify-between mb-3">
                                    <span className="text-sm font-medium text-gray-600">
                                      Question {qIndex + 1}
                                    </span>
                                    <button
                                      onClick={() => {
                                        setChapters(
                                          chapters.map((ch) => {
                                            if (ch.id === chapter.id && ch.quiz) {
                                              return {
                                                ...ch,
                                                quiz: {
                                                  ...ch.quiz,
                                                  questions: ch.quiz.questions.filter(
                                                    (q) => q.id !== question.id
                                                  ),
                                                },
                                              }
                                            }
                                            return ch
                                          })
                                        )
                                      }}
                                      className="text-red-600 hover:bg-red-50 p-1 rounded transition-colors"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>

                                  <input
                                    type="text"
                                    value={question.question}
                                    onChange={(e) =>
                                      updateQuestion(
                                        chapter.id,
                                        question.id,
                                        'question',
                                        e.target.value
                                      )
                                    }
                                    className="input-field mb-3"
                                    placeholder="Enter your question"
                                  />

                                  <div className="space-y-2">
                                    {question.options.map((option, optIndex) => (
                                      <div key={optIndex} className="flex items-center gap-2">
                                        <input
                                          type="radio"
                                          checked={question.correctAnswer === optIndex}
                                          onChange={() =>
                                            updateQuestion(
                                              chapter.id,
                                              question.id,
                                              'correctAnswer',
                                              optIndex
                                            )
                                          }
                                          className="w-4 h-4 text-primary-600"
                                        />
                                        <input
                                          type="text"
                                          value={option}
                                          onChange={(e) => {
                                            const newOptions = [...question.options]
                                            newOptions[optIndex] = e.target.value
                                            updateQuestion(
                                              chapter.id,
                                              question.id,
                                              'options',
                                              newOptions
                                            )
                                          }}
                                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                          placeholder={`Option ${optIndex + 1}`}
                                        />
                                      </div>
                                    ))}
                                  </div>

                                  <textarea
                                    value={question.explanation || ''}
                                    onChange={(e) =>
                                      updateQuestion(
                                        chapter.id,
                                        question.id,
                                        'explanation',
                                        e.target.value
                                      )
                                    }
                                    className="input-field mt-3 min-h-[60px]"
                                    placeholder="Explanation (optional)"
                                  />
                                </div>
                              ))}
                            </div>

                            <button
                              onClick={() => addQuestion(chapter.id)}
                              className="w-full py-2 border-2 border-dashed border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors text-sm font-medium"
                            >
                              + Add Question
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {chapters.length === 0 && (
              <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg">
                <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No chapters yet. Start building your course!</p>
                <button
                  onClick={addChapter}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Add Your First Chapter
                </button>
              </div>
            )}
          </div>
        )}

        {/* Pricing Tab */}
        {activeTab === 'pricing' && (
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Price (USD) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">
                  $
                </span>
                <input
                  type="number"
                  value={courseData.price}
                  onChange={(e) =>
                    setCourseData({ ...courseData, price: parseFloat(e.target.value) })
                  }
                  className="input-field pl-8"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Set to 0 for free courses
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Publishing Checklist</h4>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-center">
                  <span className={courseData.title ? 'text-green-600' : 'text-gray-400'}>
                    {courseData.title ? '✓' : '○'}
                  </span>
                  <span className="ml-2">Course title and description</span>
                </li>
                <li className="flex items-center">
                  <span className={courseData.category ? 'text-green-600' : 'text-gray-400'}>
                    {courseData.category ? '✓' : '○'}
                  </span>
                  <span className="ml-2">Category and level selected</span>
                </li>
                <li className="flex items-center">
                  <span className={chapters.length > 0 ? 'text-green-600' : 'text-gray-400'}>
                    {chapters.length > 0 ? '✓' : '○'}
                  </span>
                  <span className="ml-2">At least one chapter added</span>
                </li>
                <li className="flex items-center">
                  <span
                    className={
                      courseData.price >= 0 ? 'text-green-600' : 'text-gray-400'
                    }
                  >
                    {courseData.price >= 0 ? '✓' : '○'}
                  </span>
                  <span className="ml-2">Price set</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Chapters:</span>
                  <span className="font-medium text-gray-900">{chapters.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Lessons:</span>
                  <span className="font-medium text-gray-900">
                    {chapters.reduce((acc, ch) => acc + ch.lessons.length, 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Video Lessons:</span>
                  <span className="font-medium text-gray-900">
                    {chapters.reduce(
                      (acc, ch) =>
                        acc + ch.lessons.filter((l) => l.type === 'video').length,
                      0
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Text Lessons:</span>
                  <span className="font-medium text-gray-900">
                    {chapters.reduce(
                      (acc, ch) =>
                        acc + ch.lessons.filter((l) => l.type === 'text').length,
                      0
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quizzes:</span>
                  <span className="font-medium text-gray-900">
                    {chapters.filter((ch) => ch.quiz).length}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <span className="text-gray-600 font-medium">Course Price:</span>
                  <span className="font-bold text-primary-600 text-lg">
                    ${courseData.price.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
