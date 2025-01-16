class TutorMatcher:
    def __init__(self, tutor_data, request_data):
        self.weights = {
            'aim_match': 1.0,
            'experience': 1.0,
            'teaching_styles': 0.1
        }

        self.tutor_data = tutor_data
        self.request_data = request_data
        self.type = request_data['type']
        self.tutor_score = tutor_data['score']
        self.request_aim = request_data['aim']
        self.request_max_score = float(request_data['max_score'])
        self.tutor_exp = tutor_data['experience']
        self.tutor_styles = tutor_data['teaching_styles']
        self.request_styles = request_data['teaching_styles']

    def is_qualified(self):
        if self.type == 'subject':
            level_map = {'Beginner': 1, 'Intermediate': 2, 'Advanced': 3, 'Expert':4}
            if level_map[self.tutor_score] < level_map[self.request_aim]:
                return False
        return True
    
    def calculate_aim(self):
        if self.type == 'exam':
            diff = round((float(self.tutor_score) - float(self.request_aim)) / self.request_max_score * 100, 2)
        else:
            level_map = {'Beginner': 1, 'Intermediate': 2, 'Advanced': 3, 'Expert':4}
            diff = level_map[self.tutor_score] - level_map[self.request_aim]
        return diff * self.weights['aim_match']
    
    def calculate_experience(self):
        if self.tutor_exp == "<1":
            diff = 0.5
        elif self.tutor_exp == ">6":
            if self.type == "exam":
                diff = 7 
            else:
                diff = 6 - (self.tutor_grade - self.request_grade)*self.weights['grade_match']
        else:
            diff = int(self.tutor_exp)
        return diff * self.weights['experience']
    
    def calculate_teaching_styles(self):
        score = 0
        for i in self.request_styles:
            if i in self.tutor_styles:
                score += 1
        return score * self.weights['teaching_styles']
    
    def calculate_overall_score(self):
        if not self.is_qualified():
            return 0
        return (
            self.calculate_aim() +
            self.calculate_experience() +
            self.calculate_teaching_styles()
        )