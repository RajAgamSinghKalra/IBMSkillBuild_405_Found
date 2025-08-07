#!/usr/bin/env python3
"""
EmpowerYouth AI Career Coach - Backend API Testing
Tests all backend endpoints comprehensively
"""

import requests
import json
import uuid
import time
from datetime import datetime

# Configuration
BASE_URL = "https://81846a97-4a39-4364-9644-55d559f96cfa.preview.emergentagent.com/api"
TEST_USER_DATA = {
    "name": "Priya Sharma",
    "email": f"priya.sharma.{uuid.uuid4().hex[:8]}@example.com",
    "phone": "+91-9876543210",
    "password": "SecurePass123!",
    "location": "Mumbai",
    "experience": "fresher"
}

# Global variables for test state
auth_token = None
user_id = None
session_id = None

def log_test(test_name, status, details=""):
    """Log test results with timestamp"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    status_symbol = "✅" if status == "PASS" else "❌" if status == "FAIL" else "⚠️"
    print(f"[{timestamp}] {status_symbol} {test_name}: {status}")
    if details:
        print(f"    Details: {details}")
    print()

def make_request(method, endpoint, data=None, headers=None, auth_required=False):
    """Make HTTP request with proper error handling"""
    url = f"{BASE_URL}{endpoint}"
    
    # Add auth header if required
    if auth_required and auth_token:
        if not headers:
            headers = {}
        headers["Authorization"] = f"Bearer {auth_token}"
    
    try:
        if method == "GET":
            response = requests.get(url, headers=headers, timeout=30)
        elif method == "POST":
            response = requests.post(url, json=data, headers=headers, timeout=30)
        elif method == "PUT":
            response = requests.put(url, json=data, headers=headers, timeout=30)
        elif method == "DELETE":
            response = requests.delete(url, headers=headers, timeout=30)
        else:
            raise ValueError(f"Unsupported method: {method}")
            
        return response
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        return None

def test_root_endpoint():
    """Test the root API endpoint"""
    print("=" * 60)
    print("TESTING: Root API Endpoint")
    print("=" * 60)
    
    response = make_request("GET", "/")
    
    if response is None:
        log_test("Root Endpoint", "FAIL", "Request failed")
        return False
    
    if response.status_code == 200:
        try:
            data = response.json()
            if "message" in data and "EmpowerYouth API is running" in data["message"]:
                log_test("Root Endpoint", "PASS", f"API is running: {data['message']}")
                return True
            else:
                log_test("Root Endpoint", "FAIL", f"Unexpected response: {data}")
                return False
        except json.JSONDecodeError:
            log_test("Root Endpoint", "FAIL", "Invalid JSON response")
            return False
    else:
        log_test("Root Endpoint", "FAIL", f"Status: {response.status_code}, Response: {response.text}")
        return False

def test_user_registration():
    """Test user registration endpoint"""
    global auth_token, user_id
    
    print("=" * 60)
    print("TESTING: User Registration System")
    print("=" * 60)
    
    # Test successful registration
    response = make_request("POST", "/auth/register", TEST_USER_DATA)
    
    if response is None:
        log_test("User Registration", "FAIL", "Request failed")
        return False
    
    if response.status_code == 200:
        try:
            data = response.json()
            if "user" in data and "token" in data:
                auth_token = data["token"]
                user_id = data["user"]["id"]
                log_test("User Registration", "PASS", f"User created with ID: {user_id}")
                
                # Verify user data
                user = data["user"]
                if (user["name"] == TEST_USER_DATA["name"] and 
                    user["email"] == TEST_USER_DATA["email"] and
                    user["phone"] == TEST_USER_DATA["phone"]):
                    log_test("User Data Validation", "PASS", "All user fields correctly stored")
                else:
                    log_test("User Data Validation", "FAIL", "User data mismatch")
                    return False
                
                return True
            else:
                log_test("User Registration", "FAIL", f"Missing user or token in response: {data}")
                return False
        except json.JSONDecodeError:
            log_test("User Registration", "FAIL", "Invalid JSON response")
            return False
    else:
        log_test("User Registration", "FAIL", f"Status: {response.status_code}, Response: {response.text}")
        return False

def test_duplicate_registration():
    """Test duplicate email handling"""
    print("=" * 60)
    print("TESTING: Duplicate Email Handling")
    print("=" * 60)
    
    # Try to register with same email
    response = make_request("POST", "/auth/register", TEST_USER_DATA)
    
    if response is None:
        log_test("Duplicate Registration", "FAIL", "Request failed")
        return False
    
    if response.status_code == 400:
        try:
            data = response.json()
            if "error" in data and "already exists" in data["error"].lower():
                log_test("Duplicate Registration", "PASS", "Correctly rejected duplicate email")
                return True
            else:
                log_test("Duplicate Registration", "FAIL", f"Unexpected error message: {data}")
                return False
        except json.JSONDecodeError:
            log_test("Duplicate Registration", "FAIL", "Invalid JSON response")
            return False
    else:
        log_test("Duplicate Registration", "FAIL", f"Expected 400, got {response.status_code}")
        return False

def test_auth_me_endpoint():
    """Test the /auth/me endpoint"""
    print("=" * 60)
    print("TESTING: Authentication Token Validation")
    print("=" * 60)
    
    if not auth_token:
        log_test("Auth Me Endpoint", "FAIL", "No auth token available")
        return False
    
    # Test with valid token
    response = make_request("GET", "/auth/me", auth_required=True)
    
    if response is None:
        log_test("Auth Me Endpoint", "FAIL", "Request failed")
        return False
    
    if response.status_code == 200:
        try:
            data = response.json()
            if "id" in data and data["id"] == user_id:
                log_test("Auth Me Endpoint", "PASS", f"Successfully retrieved user: {data['name']}")
                return True
            else:
                log_test("Auth Me Endpoint", "FAIL", f"User ID mismatch or missing: {data}")
                return False
        except json.JSONDecodeError:
            log_test("Auth Me Endpoint", "FAIL", "Invalid JSON response")
            return False
    else:
        log_test("Auth Me Endpoint", "FAIL", f"Status: {response.status_code}, Response: {response.text}")
        return False

def test_invalid_token():
    """Test invalid token handling"""
    print("=" * 60)
    print("TESTING: Invalid Token Handling")
    print("=" * 60)
    
    # Test with invalid token
    headers = {"Authorization": "Bearer invalid_token_123"}
    response = make_request("GET", "/auth/me", headers=headers)
    
    if response is None:
        log_test("Invalid Token", "FAIL", "Request failed")
        return False
    
    if response.status_code == 401:
        try:
            data = response.json()
            if "error" in data:
                log_test("Invalid Token", "PASS", "Correctly rejected invalid token")
                return True
            else:
                log_test("Invalid Token", "FAIL", f"Missing error message: {data}")
                return False
        except json.JSONDecodeError:
            log_test("Invalid Token", "FAIL", "Invalid JSON response")
            return False
    else:
        log_test("Invalid Token", "FAIL", f"Expected 401, got {response.status_code}")
        return False

def test_career_assessment():
    """Test career assessment submission"""
    print("=" * 60)
    print("TESTING: Career Assessment API")
    print("=" * 60)
    
    if not auth_token:
        log_test("Career Assessment", "FAIL", "No auth token available")
        return False
    
    # Sample assessment data
    assessment_data = {
        "interests": ["Technology", "Business"],
        "skills": ["Programming", "Communication", "Data Analysis"],
        "goals": ["Get a good job", "Learn new skills"],
        "challenges": ["Lack of experience", "Interview anxiety"],
        "workPreference": "remote",
        "careerStage": "entry-level"
    }
    
    response = make_request("POST", "/assessment/submit", assessment_data, auth_required=True)
    
    if response is None:
        log_test("Career Assessment", "FAIL", "Request failed")
        return False
    
    if response.status_code == 200:
        try:
            data = response.json()
            if "success" in data and data["success"] and "skillVector" in data:
                skill_vector = data["skillVector"]
                if len(skill_vector) > 0:
                    log_test("Career Assessment", "PASS", f"Assessment processed, {len(skill_vector)} skills generated")
                    
                    # Verify skill structure
                    first_skill = skill_vector[0]
                    if "name" in first_skill and "level" in first_skill:
                        log_test("Skill Vector Generation", "PASS", f"Skills: {[s['name'] for s in skill_vector[:3]]}")
                        return True
                    else:
                        log_test("Skill Vector Generation", "FAIL", "Invalid skill structure")
                        return False
                else:
                    log_test("Career Assessment", "FAIL", "Empty skill vector")
                    return False
            else:
                log_test("Career Assessment", "FAIL", f"Unexpected response: {data}")
                return False
        except json.JSONDecodeError:
            log_test("Career Assessment", "FAIL", "Invalid JSON response")
            return False
    else:
        log_test("Career Assessment", "FAIL", f"Status: {response.status_code}, Response: {response.text}")
        return False

def test_dashboard_api():
    """Test personalized dashboard API"""
    print("=" * 60)
    print("TESTING: Personalized Dashboard API")
    print("=" * 60)
    
    if not auth_token:
        log_test("Dashboard API", "FAIL", "No auth token available")
        return False
    
    response = make_request("GET", "/dashboard", auth_required=True)
    
    if response is None:
        log_test("Dashboard API", "FAIL", "Request failed")
        return False
    
    if response.status_code == 200:
        try:
            data = response.json()
            
            # Check required dashboard components
            required_fields = ["skills", "jobMatches", "jobs", "courses", "recommendedCourses", "progress"]
            missing_fields = [field for field in required_fields if field not in data]
            
            if not missing_fields:
                log_test("Dashboard API", "PASS", "All dashboard components present")
                
                # Test job matches
                if len(data["jobMatches"]) > 0:
                    job = data["jobMatches"][0]
                    if "title" in job and "company" in job and "matchPercentage" in job:
                        log_test("Job Matching", "PASS", f"Found {len(data['jobMatches'])} job matches")
                    else:
                        log_test("Job Matching", "FAIL", "Invalid job structure")
                        return False
                
                # Test course recommendations
                if len(data["recommendedCourses"]) > 0:
                    course = data["recommendedCourses"][0]
                    if "title" in course and "provider" in course:
                        log_test("Course Recommendations", "PASS", f"Found {len(data['recommendedCourses'])} course recommendations")
                    else:
                        log_test("Course Recommendations", "FAIL", "Invalid course structure")
                        return False
                
                # Test progress tracking
                progress = data["progress"]
                if "profileCompletion" in progress and "coursesCompleted" in progress:
                    log_test("Progress Tracking", "PASS", f"Profile completion: {progress['profileCompletion']}%")
                else:
                    log_test("Progress Tracking", "FAIL", "Invalid progress structure")
                    return False
                
                return True
            else:
                log_test("Dashboard API", "FAIL", f"Missing fields: {missing_fields}")
                return False
                
        except json.JSONDecodeError:
            log_test("Dashboard API", "FAIL", "Invalid JSON response")
            return False
    else:
        log_test("Dashboard API", "FAIL", f"Status: {response.status_code}, Response: {response.text}")
        return False

def test_ai_chatbot():
    """Test AI chatbot API"""
    global session_id
    
    print("=" * 60)
    print("TESTING: AI Chatbot API")
    print("=" * 60)
    
    if not auth_token:
        log_test("AI Chatbot", "FAIL", "No auth token available")
        return False
    
    # Test different types of questions
    test_messages = [
        {"message": "How can I improve my resume?", "expected_keywords": ["resume", "tips"]},
        {"message": "Tell me about interview preparation", "expected_keywords": ["interview", "preparation"]},
        {"message": "What career options do I have?", "expected_keywords": ["career", "opportunities"]},
        {"message": "How can I learn new skills?", "expected_keywords": ["skill", "development"]}
    ]
    
    for i, test_case in enumerate(test_messages):
        chat_data = {
            "message": test_case["message"],
            "language": "en",
            "sessionId": session_id
        }
        
        response = make_request("POST", "/chat", chat_data, auth_required=True)
        
        if response is None:
            log_test(f"Chat Message {i+1}", "FAIL", "Request failed")
            continue
        
        if response.status_code == 200:
            try:
                data = response.json()
                if "response" in data and "sessionId" in data:
                    session_id = data["sessionId"]  # Store for next message
                    bot_response = data["response"].lower()
                    
                    # Check if response contains expected keywords
                    has_keywords = any(keyword in bot_response for keyword in test_case["expected_keywords"])
                    
                    if has_keywords:
                        log_test(f"Chat Message {i+1}", "PASS", f"Relevant response for: '{test_case['message'][:30]}...'")
                    else:
                        log_test(f"Chat Message {i+1}", "WARN", f"Generic response for: '{test_case['message'][:30]}...'")
                else:
                    log_test(f"Chat Message {i+1}", "FAIL", f"Missing response or sessionId: {data}")
                    return False
            except json.JSONDecodeError:
                log_test(f"Chat Message {i+1}", "FAIL", "Invalid JSON response")
                return False
        else:
            log_test(f"Chat Message {i+1}", "FAIL", f"Status: {response.status_code}")
            return False
    
    log_test("AI Chatbot Overall", "PASS", "Chat functionality working with mock responses")
    return True

def test_jobs_api():
    """Test jobs listing API"""
    print("=" * 60)
    print("TESTING: Jobs API")
    print("=" * 60)
    
    if not auth_token:
        log_test("Jobs API", "FAIL", "No auth token available")
        return False
    
    response = make_request("GET", "/jobs", auth_required=True)
    
    if response is None:
        log_test("Jobs API", "FAIL", "Request failed")
        return False
    
    if response.status_code == 200:
        try:
            data = response.json()
            if "jobs" in data and len(data["jobs"]) > 0:
                job = data["jobs"][0]
                required_fields = ["id", "title", "company", "location", "salary", "skills"]
                missing_fields = [field for field in required_fields if field not in job]
                
                if not missing_fields:
                    log_test("Jobs API", "PASS", f"Found {len(data['jobs'])} jobs with complete data")
                    return True
                else:
                    log_test("Jobs API", "FAIL", f"Job missing fields: {missing_fields}")
                    return False
            else:
                log_test("Jobs API", "FAIL", "No jobs found in response")
                return False
        except json.JSONDecodeError:
            log_test("Jobs API", "FAIL", "Invalid JSON response")
            return False
    else:
        log_test("Jobs API", "FAIL", f"Status: {response.status_code}, Response: {response.text}")
        return False

def test_courses_api():
    """Test courses listing API"""
    print("=" * 60)
    print("TESTING: Courses API")
    print("=" * 60)
    
    if not auth_token:
        log_test("Courses API", "FAIL", "No auth token available")
        return False
    
    response = make_request("GET", "/courses", auth_required=True)
    
    if response is None:
        log_test("Courses API", "FAIL", "Request failed")
        return False
    
    if response.status_code == 200:
        try:
            data = response.json()
            if "courses" in data and len(data["courses"]) > 0:
                course = data["courses"][0]
                required_fields = ["id", "title", "provider", "description", "duration", "skills"]
                missing_fields = [field for field in required_fields if field not in course]
                
                if not missing_fields:
                    # Check for different providers
                    providers = set(c["provider"] for c in data["courses"])
                    expected_providers = {"IBM SkillsBuild", "Coursera", "NSDC"}
                    
                    if expected_providers.intersection(providers):
                        log_test("Courses API", "PASS", f"Found {len(data['courses'])} courses from providers: {list(providers)}")
                        return True
                    else:
                        log_test("Courses API", "WARN", f"Unexpected providers: {list(providers)}")
                        return True
                else:
                    log_test("Courses API", "FAIL", f"Course missing fields: {missing_fields}")
                    return False
            else:
                log_test("Courses API", "FAIL", "No courses found in response")
                return False
        except json.JSONDecodeError:
            log_test("Courses API", "FAIL", "Invalid JSON response")
            return False
    else:
        log_test("Courses API", "FAIL", f"Status: {response.status_code}, Response: {response.text}")
        return False

def test_job_application():
    """Test job application API"""
    print("=" * 60)
    print("TESTING: Job Application API")
    print("=" * 60)
    
    if not auth_token:
        log_test("Job Application", "FAIL", "No auth token available")
        return False
    
    # First get a job ID
    jobs_response = make_request("GET", "/jobs", auth_required=True)
    if jobs_response and jobs_response.status_code == 200:
        jobs_data = jobs_response.json()
        if "jobs" in jobs_data and len(jobs_data["jobs"]) > 0:
            job_id = jobs_data["jobs"][0]["id"]
            
            # Apply to the job
            application_data = {"jobId": job_id}
            response = make_request("POST", "/apply", application_data, auth_required=True)
            
            if response is None:
                log_test("Job Application", "FAIL", "Request failed")
                return False
            
            if response.status_code == 200:
                try:
                    data = response.json()
                    if "success" in data and data["success"]:
                        log_test("Job Application", "PASS", "Successfully applied to job")
                        return True
                    else:
                        log_test("Job Application", "FAIL", f"Application failed: {data}")
                        return False
                except json.JSONDecodeError:
                    log_test("Job Application", "FAIL", "Invalid JSON response")
                    return False
            else:
                log_test("Job Application", "FAIL", f"Status: {response.status_code}, Response: {response.text}")
                return False
        else:
            log_test("Job Application", "FAIL", "No jobs available to apply to")
            return False
    else:
        log_test("Job Application", "FAIL", "Could not fetch jobs for application test")
        return False

def test_authentication_required_endpoints():
    """Test that protected endpoints require authentication"""
    print("=" * 60)
    print("TESTING: Authentication Required Endpoints")
    print("=" * 60)
    
    protected_endpoints = [
        ("GET", "/auth/me"),
        ("POST", "/assessment/submit"),
        ("GET", "/dashboard"),
        ("POST", "/chat"),
        ("GET", "/jobs"),
        ("GET", "/courses"),
        ("POST", "/apply")
    ]
    
    all_protected = True
    
    for method, endpoint in protected_endpoints:
        response = make_request(method, endpoint, {"test": "data"} if method == "POST" else None)
        
        if response is None:
            log_test(f"Auth Required {endpoint}", "FAIL", "Request failed")
            all_protected = False
            continue
        
        if response.status_code == 401:
            log_test(f"Auth Required {endpoint}", "PASS", "Correctly requires authentication")
        else:
            log_test(f"Auth Required {endpoint}", "FAIL", f"Expected 401, got {response.status_code}")
            all_protected = False
    
    return all_protected

def run_all_tests():
    """Run all backend tests"""
    print("🚀 Starting EmpowerYouth Backend API Tests")
    print("=" * 80)
    
    test_results = []
    
    # High Priority Tests
    print("\n🔥 HIGH PRIORITY TESTS")
    test_results.append(("Root Endpoint", test_root_endpoint()))
    test_results.append(("User Registration", test_user_registration()))
    test_results.append(("Duplicate Email Handling", test_duplicate_registration()))
    test_results.append(("Auth Token Validation", test_auth_me_endpoint()))
    test_results.append(("Invalid Token Handling", test_invalid_token()))
    test_results.append(("Career Assessment", test_career_assessment()))
    test_results.append(("Dashboard API", test_dashboard_api()))
    
    # Medium Priority Tests
    print("\n⚡ MEDIUM PRIORITY TESTS")
    test_results.append(("AI Chatbot", test_ai_chatbot()))
    test_results.append(("Jobs API", test_jobs_api()))
    test_results.append(("Courses API", test_courses_api()))
    test_results.append(("Job Application", test_job_application()))
    test_results.append(("Authentication Protection", test_authentication_required_endpoints()))
    
    # Summary
    print("\n" + "=" * 80)
    print("📊 TEST SUMMARY")
    print("=" * 80)
    
    passed = sum(1 for _, result in test_results if result)
    total = len(test_results)
    
    for test_name, result in test_results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} {test_name}")
    
    print(f"\n🎯 Overall Result: {passed}/{total} tests passed ({passed/total*100:.1f}%)")
    
    if passed == total:
        print("🎉 All tests passed! Backend is working correctly.")
    elif passed >= total * 0.8:
        print("⚠️  Most tests passed. Minor issues detected.")
    else:
        print("🚨 Multiple test failures. Backend needs attention.")
    
    return test_results

if __name__ == "__main__":
    run_all_tests()