# Toast Tutor 🍞📚

<div align="center">
  <img width="1280" alt="Screenshot 2025-05-28 at 9 49 06 PM" src="https://github.com/user-attachments/assets/22bcb795-5c01-4e10-a853-26e29d4048eb" />
</div>



A web application that connects tutors with students based on personalized learning needs, availability, and teaching preferences.

## ✨ Features

- **Authentication**: Secure login with role-based access for students and tutors
- **Smart Matching**: Intelligent tutor-student pairing based on subject, level, timing, and teaching style
- **Customizable Profiles**: Detailed profiles for both students and tutors with preferences and expertise
- **Booking System**: Easy session scheduling with flexible timing and subject selection
- **Payment Integration**: Secure Stripe payment processing with automated billing
- **Rating System**: Comprehensive feedback and review system with performance metrics
- **Tutor Dashboard**: Session management, earnings tracking, and student progress monitoring
- **Real-time Notifications**: Toast notifications for bookings, messages, and updates

## 🚀 Setup

**Prerequisites**: Python 3.8+, Node.js 14+, Redis, Supabase account, Stripe account

1. **Clone and Install**
   ```bash
   git clone https://github.com/ttrang87/toast-tutor.git
   cd toast-tutor
   
   # Backend
   cd backend
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   
   # Frontend  
   cd ../frontend
   npm install
   ```

2. **Environment Setup**
   ```bash
   # Backend .env
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   STRIPE_SECRET_KEY=your_stripe_secret
   REDIS_URL=redis://localhost:6379
   
   # Frontend .env.local
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_key
   REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_public_key
   ```

3. **Run**
   ```bash
   # Start Redis
   redis-server
   
   # Backend
   cd backend && python manage.py runserver
   
   # Frontend
   cd frontend && npm start
   ```

Access: Frontend at `http://localhost:3000`, API at `http://localhost:8000`

## 🏗️ Tech Stack

**Frontend**: React.js + Tailwind CSS  
**Backend**: Django (Python) + Supabase  
**Database**: PostgreSQL (via Supabase)  
**Payments**: Stripe  
**Caching**: Redis  
**Notifications**: Toast

## 📱 Usage

**Students**: Create account → Browse tutors → Book sessions → Make payment → Attend & rate  
**Tutors**: Create profile → Set availability → Receive bookings → Track earnings → Manage sessions

## 🔧 API

Key endpoints: `/api/auth/`, `/api/users/`, `/api/tutors/`, `/api/bookings/`, `/api/payments/`, `/api/reviews/`

Authentication: Include JWT token in Authorization header: `Bearer <token>`

## 🤝 Contributing

1. Fork the repo
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see [LICENSE.md](LICENSE.md)

