from django.test import TestCase

# Replace with the correct module path
from .controller.algorithm import TutorMatcher


class TutorMatcherTestCase(TestCase):
    def setUp(self):
        # Sample data for testing
        self.tutor_data = {
            "score": "intermediate",
            "experience": "3",
            "teaching_styles": ["visual", "interactive"],
        }
        self.request_data = {
            "type": "subject",
            "aim": "beginner",
            "max_score": "100",
            "teaching_styles": ["visual", "textual"],
        }
        self.matcher = TutorMatcher(self.tutor_data, self.request_data)

    def test_is_qualified(self):
        self.assertTrue(self.matcher.is_qualified())

    def test_calculate_aim(self):
        aim_score = self.matcher.calculate_aim()
        self.assertEqual(aim_score, 1.0)  # Adjust based on expected output

    def test_calculate_experience(self):
        experience_score = self.matcher.calculate_experience()
        # Adjust based on expected output
        self.assertEqual(experience_score, 3.0)

    def test_calculate_teaching_styles(self):
        teaching_styles_score = self.matcher.calculate_teaching_styles()
        # Adjust based on expected output
        self.assertEqual(teaching_styles_score, 0.1)

    def test_calculate_overall_score(self):
        overall_score = self.matcher.calculate_overall_score()
        self.assertGreater(overall_score, 0)
