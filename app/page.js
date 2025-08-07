'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { 
  User, 
  MapPin, 
  Briefcase, 
  BookOpen, 
  MessageCircle, 
  TrendingUp, 
  Star,
  Send,
  ChevronRight,
  Target,
  Award,
  Clock,
  IndianRupee,
  Globe,
  Users,
  Sparkles
} from 'lucide-react'

export default function EmpowerYouthApp() {
  const [currentStep, setCurrentStep] = useState('welcome') // welcome, signup, assessment, dashboard
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [assessmentData, setAssessmentData] = useState({})
  const [chatMessages, setChatMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [dashboardData, setDashboardData] = useState(null)

  // Check if user is logged in on load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
          setCurrentStep('dashboard')
          await loadDashboard()
        }
      } catch (error) {
        console.log('Not authenticated')
      }
    }
    checkAuth()
  }, [])

  const loadDashboard = async () => {
    try {
      const response = await fetch('/api/dashboard')
      if (response.ok) {
        const data = await response.json()
        setDashboardData(data)
      }
    } catch (error) {
      console.error('Failed to load dashboard:', error)
    }
  }

  const handleSignup = async (formData) => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        const userData = await response.json()
        setUser(userData.user)
        toast.success("Welcome to EmpowerYouth!", {
          description: "Your account has been created successfully.",
        })
        setCurrentStep('assessment')
      } else {
        const error = await response.json()
        toast.error("Registration failed", {
          description: error.error || "Please try again",
        })
      }
    } catch (error) {
      toast.error("Registration failed", {
        description: "Network error. Please try again",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAssessment = async (assessment) => {
    setLoading(true)
    try {
      const response = await fetch('/api/assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assessment)
      })
      
      if (response.ok) {
        toast.success("Assessment completed!", {
          description: "Your personalized career recommendations are ready.",
        })
        setCurrentStep('dashboard')
        await loadDashboard()
      }
    } catch (error) {
      toast({
        title: "Assessment failed",
        description: "Please try again",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const sendChatMessage = async (message) => {
    if (!message.trim()) return

    const newMessages = [...chatMessages, { type: 'user', content: message }]
    setChatMessages(newMessages)
    setChatInput('')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, language: 'en' })
      })
      
      if (response.ok) {
        const data = await response.json()
        setChatMessages(prev => [...prev, { type: 'bot', content: data.response }])
      }
    } catch (error) {
      setChatMessages(prev => [...prev, { 
        type: 'bot', 
        content: 'Sorry, I am having trouble connecting. Please try again.' 
      }])
    }
  }

  if (currentStep === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 bg-white rounded-full px-6 py-2 shadow-lg mb-6">
                <Globe className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-600">UN SDG 8 Aligned</span>
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                Empower<span className="text-blue-600">Youth</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Your AI Career Coach for Decent Work
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <Target className="h-8 w-8 text-teal-600 mb-2" />
                  <CardTitle>Personalized Guidance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">AI-powered career assessment and job matching tailored for Indian youth</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <BookOpen className="h-8 w-8 text-blue-600 mb-2" />
                  <CardTitle>Skills Development</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Access courses from IBM SkillsBuild, Coursera and NSDC to bridge skill gaps</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <MessageCircle className="h-8 w-8 text-green-600 mb-2" />
                  <CardTitle>Multilingual Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Chat in English, Hindi, Bengali, or Tamil with our AI career counselor</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4"
                onClick={() => setCurrentStep('signup')}
              >
                Start Your Career Journey
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
              <p className="text-sm text-gray-500">
                Join thousands of Indian youth building better careers
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === 'signup') {
    return <SignupForm onSignup={handleSignup} loading={loading} />
  }

  if (currentStep === 'assessment') {
    return <CareerAssessment onSubmit={handleAssessment} loading={loading} />
  }

  if (currentStep === 'dashboard' && user) {
    return (
      <Dashboard 
        user={user} 
        dashboardData={dashboardData}
        chatMessages={chatMessages}
        chatInput={chatInput}
        setChatInput={setChatInput}
        sendChatMessage={sendChatMessage}
      />
    )
  }

  return <div>Loading...</div>
}

function SignupForm({ onSignup, loading }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    location: '',
    experience: 'fresher'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSignup(formData)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Join EmpowerYouth</CardTitle>
          <CardDescription>Create your account to get personalized career guidance</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="location">Location</Label>
              <Select onValueChange={(value) => setFormData({...formData, location: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your city" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mumbai">Mumbai</SelectItem>
                  <SelectItem value="delhi">Delhi</SelectItem>
                  <SelectItem value="bangalore">Bangalore</SelectItem>
                  <SelectItem value="chennai">Chennai</SelectItem>
                  <SelectItem value="kolkata">Kolkata</SelectItem>
                  <SelectItem value="pune">Pune</SelectItem>
                  <SelectItem value="hyderabad">Hyderabad</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Experience Level</Label>
              <RadioGroup 
                value={formData.experience}
                onValueChange={(value) => setFormData({...formData, experience: value})}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fresher" id="fresher" />
                  <Label htmlFor="fresher">Fresher (0-1 years)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="experienced" id="experienced" />
                  <Label htmlFor="experienced">Experienced (1+ years)</Label>
                </div>
              </RadioGroup>
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

function CareerAssessment({ onSubmit, loading }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})

  const questions = [
    {
      id: 'interests',
      title: 'What interests you most?',
      type: 'multiple',
      options: ['Technology', 'Business', 'Healthcare', 'Education', 'Creative Arts', 'Engineering']
    },
    {
      id: 'skills',
      title: 'Which skills do you currently have?',
      type: 'multiple',
      options: ['Programming', 'Data Analysis', 'Communication', 'Leadership', 'Design', 'Sales']
    },
    {
      id: 'workstyle',
      title: 'Preferred work style?',
      type: 'single',
      options: ['Remote', 'Office-based', 'Hybrid', 'Field work']
    },
    {
      id: 'goals',
      title: 'Career goal in next 2 years?',
      type: 'single',
      options: ['Get first job', 'Switch careers', 'Get promoted', 'Start business']
    },
    {
      id: 'learning',
      title: 'Preferred learning method?',
      type: 'single',
      options: ['Online courses', 'Classroom training', 'On-job training', 'Self-study']
    },
    {
      id: 'challenges',
      title: 'Biggest career challenge?',
      type: 'single',
      options: ['Lack of experience', 'Skill gaps', 'Limited opportunities', 'Interview anxiety']
    }
  ]

  const handleAnswer = (questionId, answer) => {
    setAnswers({...answers, [questionId]: answer})
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      onSubmit(answers)
    }
  }

  const question = questions[currentQuestion]
  const isLastQuestion = currentQuestion === questions.length - 1

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Progress value={(currentQuestion + 1) / questions.length * 100} className="mb-4" />
          <p className="text-sm text-gray-600">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{question.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {question.type === 'single' ? (
              <RadioGroup
                value={answers[question.id] || ''}
                onValueChange={(value) => handleAnswer(question.id, value)}
              >
                {question.options.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={option} />
                    <Label htmlFor={option}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <div className="space-y-2">
                {question.options.map((option) => (
                  <label key={option} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={answers[question.id]?.includes(option) || false}
                      onChange={(e) => {
                        const current = answers[question.id] || []
                        if (e.target.checked) {
                          handleAnswer(question.id, [...current, option])
                        } else {
                          handleAnswer(question.id, current.filter(item => item !== option))
                        }
                      }}
                      className="rounded"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            )}

            <Button 
              onClick={handleNext} 
              className="w-full mt-6"
              disabled={loading || !answers[question.id]}
            >
              {loading ? 'Processing...' : isLastQuestion ? 'Complete Assessment' : 'Next Question'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Dashboard({ user, dashboardData, chatMessages, chatInput, setChatInput, sendChatMessage }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-600">EmpowerYouth</h1>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <span className="font-medium">Hi, {user?.name}!</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4">
        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="chat">AI Coach</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <DashboardTab dashboardData={dashboardData} />
          </TabsContent>

          <TabsContent value="jobs">
            <JobsTab jobs={dashboardData?.jobs || []} />
          </TabsContent>

          <TabsContent value="courses">
            <CoursesTab courses={dashboardData?.courses || []} />
          </TabsContent>

          <TabsContent value="chat">
            <ChatTab 
              messages={chatMessages}
              input={chatInput}
              setInput={setChatInput}
              onSend={sendChatMessage}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function DashboardTab({ dashboardData }) {
  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading your personalized dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Skills Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Your Skill Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {dashboardData.skills?.map((skill, index) => (
              <Badge key={index} variant="secondary">
                {skill.name} ({skill.level}/5)
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Job Matches */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Top 5 Job Matches
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboardData.jobMatches?.slice(0, 5).map((job, index) => (
              <div key={job.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{job.title}</h4>
                  <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">
                      {job.matchPercentage}% match
                    </Badge>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <IndianRupee className="h-3 w-3" />
                      {job.salary}
                    </span>
                  </div>
                </div>
                <Button size="sm">Apply</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommended Courses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Recommended Courses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {dashboardData.recommendedCourses?.slice(0, 4).map((course, index) => (
              <div key={course.id} className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">{course.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{course.provider}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">{course.rating}</span>
                  </div>
                  <Button size="sm" variant="outline">
                    {course.price === 'Free' ? 'Start Free' : `₹${course.price}`}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Progress Tracker */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Progress Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {dashboardData.progress?.profileCompletion || 85}%
              </div>
              <p className="text-sm text-gray-600">Profile Complete</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {dashboardData.progress?.coursesCompleted || 3}
              </div>
              <p className="text-sm text-gray-600">Courses Completed</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {dashboardData.progress?.jobApplications || 12}
              </div>
              <p className="text-sm text-gray-600">Applications Sent</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function JobsTab({ jobs }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Job Opportunities</h2>
        <Button variant="outline">Filter Jobs</Button>
      </div>
      
      <div className="grid gap-4">
        {jobs.map((job) => (
          <Card key={job.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{job.title}</h3>
                  <p className="text-gray-600 mb-3">{job.company} • {job.location}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {job.skills?.map((skill, index) => (
                      <Badge key={index} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <IndianRupee className="h-4 w-4" />
                      {job.salary}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {job.type}
                    </span>
                    {job.remote && (
                      <Badge variant="outline">Remote</Badge>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <Badge className="mb-2">
                    {job.matchPercentage}% match
                  </Badge>
                  <br />
                  <Button size="sm">Apply Now</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function CoursesTab({ courses }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Skills Development</h2>
        <Button variant="outline">Filter Courses</Button>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <Card key={course.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <Badge variant="outline">{course.provider}</Badge>
              </div>
              
              <h3 className="font-semibold mb-2">{course.title}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {course.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  {course.rating}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-semibold text-blue-600">
                  {course.price === 'Free' ? 'Free' : `₹${course.price}`}
                </span>
                <Button size="sm">
                  {course.price === 'Free' ? 'Start Free' : 'Enroll'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function ChatTab({ messages, input, setInput, onSend }) {
  const handleSend = (e) => {
    e.preventDefault()
    onSend(input)
  }

  return (
    <div className="space-y-4">
      <Card className="h-96">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            AI Career Coach
          </CardTitle>
          <CardDescription>Ask me anything about your career!</CardDescription>
        </CardHeader>
        <CardContent className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-3 mb-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 mt-8">
                <Sparkles className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <p>Hi! I'm your AI career coach. I can help with:</p>
                <ul className="text-sm mt-2 space-y-1">
                  <li>• Career guidance and planning</li>
                  <li>• Resume and interview tips</li>
                  <li>• Skill development advice</li>
                  <li>• Job market insights</li>
                </ul>
              </div>
            )}
            
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] p-3 rounded-lg ${
                  message.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  {message.content}
                </div>
              </div>
            ))}
          </div>
          
          <form onSubmit={handleSend} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your career..."
              className="flex-1"
            />
            <Button type="submit" size="sm">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}