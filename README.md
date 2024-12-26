# 📚 **StudyNotion** - *An Ed-Tech Platform* 🎓

StudyNotion is a feature-rich, full-stack educational platform that enables users to create, access, and rate various educational courses. Built on the powerful MERN stack—**MongoDB, Express, React, and Node.js**—it aims to offer an engaging learning experience for students and a productive teaching environment for instructors.

# Screenshots

Below are some screenshots demonstrating key features of the project:

## Homepage
![Homepage Screenshot](https://github.com/anshika-maurya/Ed-tech-Platform/raw/main/src/assets/Images/Screenshots/1_Homepage.jpeg)

## Key Pages and Features

<div style="width: 100%; overflow: hidden;">
   <div style="display: flex; width: 400%; animation: slide 12s infinite;">
      <img src="https://github.com/anshika-maurya/Ed-tech-Platform/raw/main/src/assets/Images/Screenshots/6_Login.png"  width="300">
      <img src="https://github.com/anshika-maurya/Ed-tech-Platform/raw/main/src/assets/Images/Screenshots/7_SignIn.png" width="300">
      <img src="https://github.com/anshika-maurya/Ed-tech-Platform/raw/main/src/assets/Images/Screenshots/5_AboutUs.png"  width="300">
      <img src="https://github.com/anshika-maurya/Ed-tech-Platform/raw/main/src/assets/Images/Screenshots/4_ContactUs.png" width="300">
      <img src="https://github.com/anshika-maurya/Ed-tech-Platform/raw/main/src/assets/Images/Screenshots/8_EnterEmailResetPassword.png"      width="300">
      <img src="https://github.com/anshika-maurya/Ed-tech-Platform/raw/main/src/assets/Images/Screenshots/9_ResendEmail.png" width="300">
      <img src="https://github.com/anshika-maurya/Ed-tech-Platform/raw/main/src/assets/Images/Screenshots/10_Setnewpassword.png"  width="300">
      <img src="https://github.com/anshika-maurya/Ed-tech-Platform/raw/main/src/assets/Images/Screenshots/11_InstructorDashboard.png" width="300">
      <img src="https://github.com/anshika-maurya/Ed-tech-Platform/raw/main/src/assets/Images/Screenshots/13_Addcourse.png"      width="300">
      <img src="https://github.com/anshika-maurya/Ed-tech-Platform/raw/main/src/assets/Images/Screenshots/14_Course-builder.png" width="300">
      <img src="https://github.com/anshika-maurya/Ed-tech-Platform/raw/main/src/assets/Images/Screenshots/15_Addinglecture.png" width="300">
      <img src="https://github.com/anshika-maurya/Ed-tech-Platform/raw/main/src/assets/Images/Screenshots/16_Publish.png"  width="300">
      <img src="https://github.com/anshika-maurya/Ed-tech-Platform/raw/main/src/assets/Images/Screenshots/17_InstructorCourses.png" width="300">
      <img src="https://github.com/anshika-maurya/Ed-tech-Platform/raw/main/src/assets/Images/Screenshots/18_DeleteCourse-modal.png"      width="300">
      <img src="https://github.com/anshika-maurya/Ed-tech-Platform/raw/main/src/assets/Images/Screenshots/19_StudentDashboard.png" width="300">
      <img src="https://github.com/anshika-maurya/Ed-tech-Platform/raw/main/src/assets/Images/Screenshots/20_Settings.png"      width="300">
      <img src="https://github.com/anshika-maurya/Ed-tech-Platform/raw/main/src/assets/Images/Screenshots/21_Log-outModal.png" width="300">
   </div>
</div>




# 🛠️ **Project Overview**


---

## 🧱 **System Architecture**

The **StudyNotion** platform adopts a client-server architecture with three main components:
- **Frontend**: Designed using ReactJS with a responsive and dynamic interface.
- **Backend**: Powered by NodeJS and Express, handling business logic, user data, and course content.
- **Database**: NoSQL data storage with MongoDB for structured, flexible content storage.

![Alt text](https://github.com/anshika-maurya/Ed-tech-Platform/raw/main/src/assets/Images/architecture.png)

---

## 🎨 **Frontend**

The frontend, developed using **ReactJS**, employs **Tailwind CSS** for styling, providing a visually appealing and responsive user experience. The interface includes:
- **Student Pages**: Home, Course List, Wishlist, Cart, User Profile.
- **Instructor Pages**: Dashboard, Insights, Course Management.
- **Admin Pages** *(Future Scope)*: Course and User Management.

*Tools and Libraries Used:* React, Tailwind CSS, Figma, Redux, and more.

---

## ⚙️ **Backend**

The backend utilizes **Node.js** and **Express.js** to support multiple functionalities, such as:
1. **User Authentication & Authorization** (with JWT and Bcrypt)
2. **Course Management** (CRUD operations)
3. **Payment Integration** with Razorpay
4. **Cloud-based Media Storage** (via Cloudinary)
5. **Content Formatting** using Markdown

*Data Models*:
- **Student Schema**
- **Instructor Schema**
- **Course Schema**

---

## 📡 **API Design**

![Alt text](https://github.com/anshika-maurya/Ed-tech-Platform/raw/main/src/assets/Images/schema.png)

### API Highlights:
Following RESTful principles, the API allows efficient and secure data management and retrieval.
- **/api/auth/signup** *(POST)* - Register a new user.
- **/api/auth/login** *(POST)* - Authenticate a user and provide a JWT token.
- **/api/courses** *(GET, POST, PUT, DELETE)* - Course management.

---

## 🚀 **Deployment**

StudyNotion is deployed on scalable platforms ensuring global accessibility:
- **Frontend**: Vercel for static React deployment.
- **Backend**: Render or Railway for Node.js.
- **Database**: MongoDB Atlas for reliable, secure storage.
- **Media Content**: Cloudinary for efficient media management.

---



## 🧩 **Get Started**

1. **Clone the Repository**
   ```bash
   git clone https://github.com/anshika-maurya/StudyNotion.git
   ```
2. **Install Dependencies**
   ```bash
   cd StudyNotion
   npm install
   ```
3. **Start the Development Server**
   ```bash
   npm start
   ```

---

## 🤝 **Contributing**

We welcome contributions to make StudyNotion even better! Please fork this repository, create a feature branch, and submit a pull request.

---

## 📄 **License**

This project is licensed under the MIT License. Please look at the [LICENSE](LICENSE) file for details.

---

With StudyNotion, we are committed to revolutionizing online education by building a platform that empowers both learners and instructors. Join us on this journey to make learning accessible, interactive, and impactful!

---
