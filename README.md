# Toast Tutor 🍞

<img width="1280" alt="Screenshot 2025-05-28 at 9 49 06 PM" src="https://github.com/user-attachments/assets/22bcb795-5c01-4e10-a853-26e29d4048eb" />

Toast Tutor streamlines the process of finding the perfect tutor-student match by considering multiple factors including time availability, subject expertise, skill levels, and preferred teaching styles. Our platform creates meaningful educational connections that lead to better learning outcomes.

## ✨ Key Features

### 🔐 Authentication System
- Secure user registration and login
- Role-based access control (Students & Tutors)
- Password reset and account verification
- Profile security and privacy controls

### 👤 Customizable Profiles
- **Student Profiles**: Learning goals, subjects needed, availability, preferred teaching styles
- **Tutor Profiles**: Expertise areas, teaching experience, availability, rates, teaching methodologies
- Upload profile pictures and portfolio materials
- Skill level indicators and certifications

### 🔍 Smart Tutor Discovery
- Advanced filtering and sorting options
- Search by subject, location, price range, and availability
- View detailed tutor profiles with ratings and reviews
- Browse tutor portfolios and teaching samples

### 📅 Intelligent Booking System
- **Subject Selection**: Choose from wide range of academic subjects
- **Level Matching**: Elementary, Middle School, High School, College, Professional
- **Time Coordination**: Flexible scheduling with calendar integration
- **Style Preferences**: Visual, auditory, kinesthetic, reading/writing learning styles
- **Smart Matching Algorithm**: Automatically suggests best tutor matches based on student needs

### 💳 Secure Payment Integration
- Multiple payment methods supported
- Secure transaction processing
- Automated billing and invoicing
- Payment history and receipts
- Refund and dispute management

### 📊 Comprehensive Tutor Dashboard
- Session management and scheduling
- Student progress tracking
- Earnings and payment analytics
- **Rating System**: 
  - Student feedback and reviews
  - Performance metrics and statistics
  - Achievement badges and certifications
- Communication tools with students

### 🎯 Additional Features
- Real-time messaging between tutors and students
- Session notes and progress reports
- Calendar synchronization
- Mobile-responsive design
- Multi-language support
- Advanced search and recommendation engine

## 🚀 Getting Started

### Prerequisites
- Python 3.8+ and pip
- Node.js (v14 or higher) and npm
- Redis server
- Supabase account and project
- Stripe account for payments

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ttrang87/toast-tutor.git
   cd toast-tutor
   ```

2. **Backend Setup (Django)**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Frontend Setup (React)**
   ```bash
   cd frontend
   npm install
   ```

4. **Environment Configuration**
   
   **Backend (.env)**
   ```bash
   cp .env.example .env
   ```
   Configure your Django environment variables:
   ```
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_KEY=your_supabase_anon_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   REDIS_URL=redis://localhost:6379
   DJANGO_SECRET_KEY=your_django_secret_key
   ```

   **Frontend (.env.local)**
   ```
   REACT_APP_SUPABASE_URL=your_supabase_project_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   REACT_APP_API_URL=http://localhost:8000
   ```

5. **Database Setup**
   ```bash
   cd backend
   python manage.py migrate
   python manage.py createsuperuser
   python manage.py loaddata fixtures/initial_data.json  # Optional: Load sample data
   ```

6. **Start Redis Server**
   ```bash
   redis-server
   ```

7. **Run the application**
   
   **Backend (Django)**
   ```bash
   cd backend
   python manage.py runserver
   ```

   **Frontend (React)**
   ```bash
   cd frontend
   npm start
   ```

8. **Access the application**
   - Frontend: `http://localhost:3000`
   - Django Admin: `http://localhost:8000/admin`
   - API: `http://localhost:8000/api`

## 🏗️ Tech Stack

### Frontend
- **React.js** - Modern UI library for building interactive interfaces
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- State management with React hooks and Context API

### Backend
- **Django (Python)** - Robust web framework for rapid development
- **Supabase** - Backend-as-a-Service for database, authentication, and real-time features
- Django REST Framework for API development
- JWT authentication integration

### Database & Storage
- **PostgreSQL** (via Supabase) - Reliable relational database
- **Redis** - In-memory caching and session storage
- Supabase Storage for file uploads

### Payment & Integrations
- **Stripe** - Secure payment processing and subscription management
- **Toast** - Notification system for real-time user feedback

### Additional Tools
- Supabase Auth for user authentication
- Real-time subscriptions via Supabase
- Django ORM for database operations
- CORS handling for cross-origin requests

## 📱 Usage

### For Students
1. **Create Account**: Sign up using Supabase Auth with your learning goals and preferences
2. **Browse Tutors**: Use advanced filters to find tutors matching your needs
3. **Book Sessions**: Select subject, level, timing, and teaching style preferences
4. **Make Payment**: Secure payment processing through Stripe integration
5. **Attend Sessions**: Join scheduled tutoring sessions with real-time notifications
6. **Rate & Review**: Provide feedback through the comprehensive rating system

### For Tutors
1. **Create Profile**: Build your profile showcasing expertise and teaching methodology
2. **Set Availability**: Define schedule and subject preferences through the dashboard
3. **Receive Bookings**: Get instant notifications when students book sessions
4. **Track Earnings**: Monitor payments and analytics through Stripe dashboard integration
5. **Manage Sessions**: Use the tutor dashboard to track student progress and ratings
6. **Real-time Updates**: Receive Toast notifications for bookings and messages

## 🔧 API Documentation

The Django REST API provides comprehensive endpoints for all platform functionality. API documentation is available at `/api/schema/` when running the development server.

### Key API Endpoints:
- `/api/auth/` - Supabase authentication integration
- `/api/users/` - User profile management and customization
- `/api/tutors/` - Tutor-specific operations and dashboard features
- `/api/bookings/` - Session booking system with intelligent matching
- `/api/payments/` - Stripe payment processing and transaction history
- `/api/reviews/` - Comprehensive rating and review system
- `/api/notifications/` - Toast notification management

### Authentication
All API requests require authentication via JWT tokens provided by Supabase Auth. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🙏 Acknowledgments

- All the amazing tutors and students who make education accessible
- Open source libraries and frameworks that power this platform
- Beta testers and early adopters who provided valuable feedback

## 📞 Support

For support, email support@toasttutor.com or join our community Discord server.

## 🗺️ Roadmap

- [ ] Mobile app development (iOS/Android)
- [ ] Group tutoring sessions
- [ ] AI-powered learning recommendations
- [ ] Integration with popular LMS platforms
- [ ] Advanced analytics and reporting
- [ ] Virtual whiteboard and collaboration tools

---

**Made with ❤️ by the Toast Tutor Team**

*Connecting learners with educators, one session at a time.*
