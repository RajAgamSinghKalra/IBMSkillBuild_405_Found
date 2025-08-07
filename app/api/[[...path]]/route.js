import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

// MongoDB connection
let client
let db

async function connectToMongo() {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URL)
    await client.connect()
    db = client.db(process.env.DB_NAME)
  }
  return db
}

// Helper function to handle CORS
function handleCORS(response) {
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  return response
}

// JWT helper functions
function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    return null
  }
}

function getAuthToken(request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  return null
}

// Mock Data Generators
function generateMockJobs(userSkills = []) {
  const jobs = [
    {
      id: uuidv4(),
      title: "Frontend Developer",
      company: "TechStart India",
      location: "Mumbai",
      salary: "3-6 LPA",
      type: "Full-time",
      remote: true,
      skills: ["JavaScript", "React", "CSS", "HTML"],
      description: "Build modern web applications using React and JavaScript",
      matchPercentage: 85,
      postedAt: new Date()
    },
    {
      id: uuidv4(),
      title: "Data Analyst",
      company: "Analytics Pro",
      location: "Bangalore",
      salary: "4-7 LPA",
      type: "Full-time",
      remote: false,
      skills: ["Python", "SQL", "Excel", "Data Analysis"],
      description: "Analyze data and create insights for business decisions",
      matchPercentage: 78,
      postedAt: new Date()
    },
    {
      id: uuidv4(),
      title: "Digital Marketing Executive",
      company: "MarketGrow",
      location: "Delhi",
      salary: "2.5-4 LPA",
      type: "Full-time",
      remote: true,
      skills: ["Digital Marketing", "SEO", "Content Writing", "Social Media"],
      description: "Drive digital marketing campaigns and grow online presence",
      matchPercentage: 72,
      postedAt: new Date()
    },
    {
      id: uuidv4(),
      title: "Sales Associate",
      company: "SalesPro India",
      location: "Chennai",
      salary: "3-5 LPA",
      type: "Full-time",
      remote: false,
      skills: ["Sales", "Communication", "Customer Service", "CRM"],
      description: "Drive sales growth and build customer relationships",
      matchPercentage: 68,
      postedAt: new Date()
    },
    {
      id: uuidv4(),
      title: "Customer Support Specialist",
      company: "SupportPlus",
      location: "Pune",
      salary: "2-4 LPA",
      type: "Full-time",
      remote: true,
      skills: ["Communication", "Problem Solving", "English", "Customer Service"],
      description: "Provide excellent customer support via chat and email",
      matchPercentage: 75,
      postedAt: new Date()
    },
    {
      id: uuidv4(),
      title: "Graphic Designer",
      company: "Creative Studio",
      location: "Hyderabad",
      salary: "2.5-5 LPA",
      type: "Full-time",
      remote: true,
      skills: ["Photoshop", "Illustrator", "Design", "Creativity"],
      description: "Create stunning visual designs for digital and print media",
      matchPercentage: 70,
      postedAt: new Date()
    }
  ]
  
  return jobs.sort((a, b) => b.matchPercentage - a.matchPercentage)
}

function generateMockCourses() {
  return [
    {
      id: uuidv4(),
      title: "Full Stack Web Development",
      provider: "IBM SkillsBuild",
      description: "Learn to build complete web applications with modern technologies",
      duration: "12 weeks",
      price: "Free",
      rating: 4.5,
      skills: ["JavaScript", "React", "Node.js", "MongoDB"],
      level: "Beginner"
    },
    {
      id: uuidv4(),
      title: "Data Science Fundamentals",
      provider: "IBM SkillsBuild",
      description: "Master the basics of data science and analytics",
      duration: "8 weeks",
      price: "Free",
      rating: 4.6,
      skills: ["Python", "Statistics", "Machine Learning", "Data Visualization"],
      level: "Beginner"
    },
    {
      id: uuidv4(),
      title: "Digital Marketing Certification",
      provider: "NSDC",
      description: "Comprehensive digital marketing skills for career growth",
      duration: "6 weeks",
      price: "2999",
      rating: 4.3,
      skills: ["SEO", "Google Ads", "Social Media Marketing", "Analytics"],
      level: "Intermediate"
    },
    {
      id: uuidv4(),
      title: "Business Communication",
      provider: "Coursera",
      description: "Improve professional communication skills",
      duration: "4 weeks",
      price: "1999",
      rating: 4.4,
      skills: ["Communication", "Presentation", "Email Writing", "English"],
      level: "Beginner"
    },
    {
      id: uuidv4(),
      title: "Python Programming",
      provider: "IBM SkillsBuild",
      description: "Learn Python programming from basics to advanced",
      duration: "10 weeks",
      price: "Free",
      rating: 4.7,
      skills: ["Python", "Programming", "Data Structures", "Algorithms"],
      level: "Beginner"
    },
    {
      id: uuidv4(),
      title: "AI and Machine Learning",
      provider: "Coursera",
      description: "Introduction to AI and ML concepts and applications",
      duration: "16 weeks",
      price: "4999",
      rating: 4.8,
      skills: ["Machine Learning", "AI", "Python", "TensorFlow"],
      level: "Advanced"
    }
  ]
}

function generateSkillVector(assessmentData) {
  // Simple skill scoring based on assessment
  const skills = []
  
  if (assessmentData.skills?.includes('Programming')) {
    skills.push({ name: 'JavaScript', level: 3 })
    skills.push({ name: 'Python', level: 2 })
  }
  
  if (assessmentData.skills?.includes('Communication')) {
    skills.push({ name: 'Communication', level: 4 })
    skills.push({ name: 'English', level: 4 })
  }
  
  if (assessmentData.skills?.includes('Data Analysis')) {
    skills.push({ name: 'Excel', level: 3 })
    skills.push({ name: 'SQL', level: 2 })
  }
  
  if (assessmentData.skills?.includes('Design')) {
    skills.push({ name: 'Photoshop', level: 3 })
    skills.push({ name: 'Design', level: 3 })
  }
  
  if (assessmentData.skills?.includes('Sales')) {
    skills.push({ name: 'Sales', level: 3 })
    skills.push({ name: 'Customer Service', level: 3 })
  }
  
  // Add some general skills based on interests
  if (assessmentData.interests?.includes('Technology')) {
    skills.push({ name: 'Problem Solving', level: 3 })
  }
  
  if (assessmentData.interests?.includes('Business')) {
    skills.push({ name: 'Leadership', level: 2 })
  }
  
  return skills.length > 0 ? skills : [
    { name: 'Communication', level: 3 },
    { name: 'Problem Solving', level: 3 },
    { name: 'Teamwork', level: 3 }
  ]
}

function generateChatResponse(message, language = 'en') {
  // Check for Watson Assistant API key
  if (process.env.WATSON_ASSISTANT_API_KEY) {
    // TODO: Implement real Watson Assistant integration
    return "Watson Assistant integration will be available once API keys are configured."
  }
  
  // Mock responses based on message content
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes('resume') || lowerMessage.includes('cv')) {
    return "Here are some resume tips: 1) Keep it concise and relevant 2) Highlight achievements with numbers 3) Use action verbs 4) Tailor it for each job. Would you like specific advice for any section?"
  }
  
  if (lowerMessage.includes('interview')) {
    return "Interview preparation tips: 1) Research the company thoroughly 2) Practice common questions 3) Prepare STAR method examples 4) Ask thoughtful questions. What type of interview are you preparing for?"
  }
  
  if (lowerMessage.includes('career') || lowerMessage.includes('job')) {
    return "I can help with career guidance! Based on your profile, I see opportunities in technology and business. What specific career questions do you have?"
  }
  
  if (lowerMessage.includes('skill') || lowerMessage.includes('learn')) {
    return "Skill development is crucial for career growth. Based on current market trends, I recommend focusing on: 1) Digital skills (programming, data analysis) 2) Soft skills (communication, leadership) 3) Industry-specific skills. What area interests you most?"
  }
  
  if (lowerMessage.includes('salary') || lowerMessage.includes('pay')) {
    return "Salary expectations should be based on: 1) Industry standards 2) Your experience level 3) Location 4) Company size. For fresher roles in India, expect 2-6 LPA depending on skills and industry. Would you like specific salary insights?"
  }
  
  return "I'm here to help with your career journey! You can ask me about job search strategies, resume writing, interview preparation, skill development, or career planning. What would you like to know?"
}

// OPTIONS handler for CORS
export async function OPTIONS() {
  return handleCORS(new NextResponse(null, { status: 200 }))
}

// Route handler function
async function handleRoute(request, { params }) {
  const { path = [] } = params
  const route = `/${path.join('/')}`
  const method = request.method

  try {
    const db = await connectToMongo()

    // Root endpoint
    if (route === '/' && method === 'GET') {
      return handleCORS(NextResponse.json({ message: "EmpowerYouth API is running!" }))
    }

    // Auth Routes
    if (route === '/auth/register' && method === 'POST') {
      const body = await request.json()
      const { name, email, phone, password, location, experience } = body
      
      if (!name || !email || !phone || !password) {
        return handleCORS(NextResponse.json(
          { error: "All fields are required" }, 
          { status: 400 }
        ))
      }

      // Check if user already exists
      const existingUser = await db.collection('users').findOne({ email })
      if (existingUser) {
        return handleCORS(NextResponse.json(
          { error: "User already exists" }, 
          { status: 400 }
        ))
      }

      const userId = uuidv4()
      const user = {
        id: userId,
        name,
        email,
        phone,
        location,
        experience,
        skillVector: [],
        createdAt: new Date(),
        assessmentCompleted: false
      }

      await db.collection('users').insertOne(user)
      
      const token = generateToken(userId)
      const { ...userWithoutPassword } = user
      
      return handleCORS(NextResponse.json({
        user: userWithoutPassword,
        token
      }))
    }

    if (route === '/auth/me' && method === 'GET') {
      const token = getAuthToken(request)
      if (!token) {
        return handleCORS(NextResponse.json({ error: "No token provided" }, { status: 401 }))
      }
      
      const decoded = verifyToken(token)
      if (!decoded) {
        return handleCORS(NextResponse.json({ error: "Invalid token" }, { status: 401 }))
      }
      
      const user = await db.collection('users').findOne({ id: decoded.userId })
      if (!user) {
        return handleCORS(NextResponse.json({ error: "User not found" }, { status: 404 }))
      }
      
      const { _id, ...userResponse } = user
      return handleCORS(NextResponse.json(userResponse))
    }

    // Assessment Routes
    if (route === '/assessment/submit' && method === 'POST') {
      const token = getAuthToken(request)
      if (!token) {
        return handleCORS(NextResponse.json({ error: "Authentication required" }, { status: 401 }))
      }
      
      const decoded = verifyToken(token)
      if (!decoded) {
        return handleCORS(NextResponse.json({ error: "Invalid token" }, { status: 401 }))
      }

      const assessmentData = await request.json()
      const skillVector = generateSkillVector(assessmentData)
      
      // Update user with assessment results
      await db.collection('users').updateOne(
        { id: decoded.userId },
        { 
          $set: { 
            skillVector,
            assessmentData,
            assessmentCompleted: true,
            updatedAt: new Date()
          }
        }
      )
      
      // Store skills separately
      await db.collection('user_skills').deleteMany({ userId: decoded.userId })
      for (const skill of skillVector) {
        await db.collection('user_skills').insertOne({
          id: uuidv4(),
          userId: decoded.userId,
          skillName: skill.name,
          level: skill.level,
          createdAt: new Date()
        })
      }
      
      return handleCORS(NextResponse.json({ success: true, skillVector }))
    }

    // Dashboard Route
    if (route === '/dashboard' && method === 'GET') {
      const token = getAuthToken(request)
      if (!token) {
        return handleCORS(NextResponse.json({ error: "Authentication required" }, { status: 401 }))
      }
      
      const decoded = verifyToken(token)
      if (!decoded) {
        return handleCORS(NextResponse.json({ error: "Invalid token" }, { status: 401 }))
      }
      
      const user = await db.collection('users').findOne({ id: decoded.userId })
      if (!user) {
        return handleCORS(NextResponse.json({ error: "User not found" }, { status: 404 }))
      }
      
      const userSkills = await db.collection('user_skills')
        .find({ userId: decoded.userId })
        .toArray()
      
      // Generate personalized recommendations
      const jobs = generateMockJobs(userSkills.map(s => s.skillName))
      const courses = generateMockCourses()
      
      // Filter courses based on user's skill gaps
      const recommendedCourses = courses.filter(course => {
        const userSkillNames = userSkills.map(s => s.skillName.toLowerCase())
        return course.skills.some(skill => 
          !userSkillNames.includes(skill.toLowerCase())
        )
      }).slice(0, 6)
      
      const dashboardData = {
        skills: userSkills.map(s => ({ name: s.skillName, level: s.level })),
        jobMatches: jobs,
        jobs: jobs,
        courses: courses,
        recommendedCourses,
        progress: {
          profileCompletion: user.assessmentCompleted ? 85 : 45,
          coursesCompleted: Math.floor(Math.random() * 5) + 1,
          jobApplications: Math.floor(Math.random() * 15) + 5
        }
      }
      
      return handleCORS(NextResponse.json(dashboardData))
    }

    // Chat Route
    if (route === '/chat' && method === 'POST') {
      const token = getAuthToken(request)
      if (!token) {
        return handleCORS(NextResponse.json({ error: "Authentication required" }, { status: 401 }))
      }
      
      const decoded = verifyToken(token)
      if (!decoded) {
        return handleCORS(NextResponse.json({ error: "Invalid token" }, { status: 401 }))
      }
      
      const { message, language = 'en', sessionId } = await request.json()
      
      if (!message) {
        return handleCORS(NextResponse.json({ error: "Message is required" }, { status: 400 }))
      }
      
      const response = generateChatResponse(message, language)
      
      // Store chat message
      const chatRecord = {
        id: uuidv4(),
        userId: decoded.userId,
        sessionId: sessionId || uuidv4(),
        userMessage: message,
        botResponse: response,
        language,
        timestamp: new Date()
      }
      
      await db.collection('chat_messages').insertOne(chatRecord)
      
      return handleCORS(NextResponse.json({ 
        response,
        sessionId: chatRecord.sessionId 
      }))
    }

    // Jobs Route  
    if (route === '/jobs' && method === 'GET') {
      const token = getAuthToken(request)
      if (!token) {
        return handleCORS(NextResponse.json({ error: "Authentication required" }, { status: 401 }))
      }
      
      const jobs = generateMockJobs()
      return handleCORS(NextResponse.json({ jobs }))
    }

    // Courses Route
    if (route === '/courses' && method === 'GET') {
      const token = getAuthToken(request)
      if (!token) {
        return handleCORS(NextResponse.json({ error: "Authentication required" }, { status: 401 }))
      }
      
      const courses = generateMockCourses()
      return handleCORS(NextResponse.json({ courses }))
    }

    // Apply to Job Route
    if (route === '/apply' && method === 'POST') {
      const token = getAuthToken(request)
      if (!token) {
        return handleCORS(NextResponse.json({ error: "Authentication required" }, { status: 401 }))
      }
      
      const decoded = verifyToken(token)
      if (!decoded) {
        return handleCORS(NextResponse.json({ error: "Invalid token" }, { status: 401 }))
      }
      
      const { jobId } = await request.json()
      
      if (!jobId) {
        return handleCORS(NextResponse.json({ error: "Job ID is required" }, { status: 400 }))
      }
      
      const application = {
        id: uuidv4(),
        userId: decoded.userId,
        jobId,
        appliedAt: new Date(),
        status: 'applied'
      }
      
      await db.collection('job_applications').insertOne(application)
      
      return handleCORS(NextResponse.json({ 
        success: true,
        message: "Application submitted successfully!"
      }))
    }

    // Route not found
    return handleCORS(NextResponse.json(
      { error: `Route ${route} not found` }, 
      { status: 404 }
    ))

  } catch (error) {
    console.error('API Error:', error)
    return handleCORS(NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    ))
  }
}

// Export all HTTP methods
export const GET = handleRoute
export const POST = handleRoute
export const PUT = handleRoute
export const DELETE = handleRoute
export const PATCH = handleRoute