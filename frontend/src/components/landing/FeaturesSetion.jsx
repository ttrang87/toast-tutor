import { ClockIcon, BookIcon, CheckIcon } from '../../assets/icon';

const FeaturesSection = () => {
    return (
        <div className="w-full bg-white rounded-2xl shadow-lg p-12">
            <div className="space-y-4">
                <span className="text-yellow-500 font-medium">WHY CHOOSE US</span>

                <div className="space-y-2">
                    <h2 className="text-4xl font-bold text-yellow-800">Experience that grows</h2>
                    <h2 className="text-4xl font-bold text-yellow-800">with your progress.</h2>
                </div>

                <p className="text-yellow-700 max-w-xl">
                    Design your perfect learning journey with flexible scheduling, personalized attention,
                    and comprehensive support for your academic goals
                </p>
            </div>

            <div className="grid grid-cols-3 gap-8 mt-12">
                <div className="space-y-4 flex flex-col">
                    {ClockIcon}
                    <h3 className="text-xl font-bold text-yellow-800">Flexible scheduling</h3>
                    <p className="text-yellow-700">
                        Book sessions that fit your schedule and manage your learning time effectively with
                        our easy-to-use booking system.
                    </p>
                </div>

                <div className="space-y-4 flex flex-col">
                    {BookIcon}
                    <h3 className="text-xl font-bold text-yellow-800">Expert tutors</h3>
                    <p className="text-yellow-700">
                        Connect with experienced tutors who specialize in your subject area and can adapt
                        to your learning style.
                    </p>
                </div>

                <div className="space-y-4 flex flex-col">
                    {CheckIcon}
                    <h3 className="text-xl font-bold text-yellow-800">Quality assurance</h3>
                    <p className="text-yellow-700">
                        Every tutor is thoroughly vetted, and we guarantee satisfaction with our
                        comprehensive quality control system.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FeaturesSection;