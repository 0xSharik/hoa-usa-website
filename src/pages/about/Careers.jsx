import React from 'react';
import SubpageTemplate from '../subpages/SubpageTemplate';

const jobOpenings = [
  {
    id: 1,
    title: 'Frontend Developer',
    type: 'Full-time',
    location: 'Remote',
    description: 'We are looking for a skilled React developer to join our team and help build amazing user experiences.',
    requirements: [
      '3+ years of experience with React.js',
      'Proficiency in JavaScript, HTML, CSS',
      'Experience with state management (Redux/Context)',
      'Familiarity with RESTful APIs'
    ]
  },
  {
    id: 2,
    title: 'Community Manager',
    type: 'Full-time',
    location: 'New York, NY',
    description: 'Join our team as a Community Manager to help build and maintain relationships with HOAs and service providers.',
    requirements: [
      '2+ years of community management experience',
      'Excellent communication skills',
      'Knowledge of HOA operations',
      'Customer service oriented'
    ]
  },
  {
    id: 3,
    title: 'UX/UI Designer',
    type: 'Contract',
    location: 'Remote',
    description: 'We need a creative designer to help us create intuitive and beautiful user interfaces.',
    requirements: [
      'Portfolio demonstrating UI/UX work',
      'Experience with Figma or Sketch',
      'Understanding of user-centered design',
      'Experience with responsive design'
    ]
  }
];

const Careers = () => {
  return (
    <SubpageTemplate
      title="Careers"
      description="Join our growing team"
      content={
        <>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
            <div className="px-4 py-5 sm:px-6 bg-gray-50">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Why Work With Us?</h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                {[
                  {
                    title: 'Competitive Benefits',
                    description: 'Health, dental, vision, 401(k), and more.',
                    icon: '🏥'
                  },
                  {
                    title: 'Flexible Work',
                    description: 'Remote work options and flexible hours.',
                    icon: '🏠'
                  },
                  {
                    title: 'Growth Opportunities',
                    description: 'Professional development and career advancement.',
                    icon: '📈'
                  }
                ].map((benefit, index) => (
                  <div key={index} className="text-center">
                    <div className="text-4xl mb-2">{benefit.icon}</div>
                    <h4 className="text-lg font-medium text-gray-900">{benefit.title}</h4>
                    <p className="mt-1 text-sm text-gray-500">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Current Openings</h3>
            
            {jobOpenings.map((job) => (
              <div key={job.id} className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{job.title}</h4>
                      <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                            <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                          </svg>
                          {job.type}
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          {job.location}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0">
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                  <p className="text-sm text-gray-500">{job.description}</p>
                  <h5 className="mt-4 text-sm font-medium text-gray-900">Requirements:</h5>
                  <ul className="mt-2 text-sm text-gray-500 list-disc pl-5 space-y-1">
                    {job.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-indigo-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Don't see a role that fits?</h3>
            <p className="text-gray-600 mb-4">We're always looking for talented individuals to join our team. Send us your resume and tell us why you'd be a great fit.</p>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit General Application
            </button>
          </div>
        </>
      }
    />
  );
};

export default Careers;
