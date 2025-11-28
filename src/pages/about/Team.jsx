import React from 'react';
import SubpageTemplate from '../subpages/SubpageTemplate';

const teamMembers = [
  {
    name: 'John Smith',
    role: 'CEO & Founder',
    bio: '20+ years of experience in community management and real estate development.',
    image: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  {
    name: 'Sarah Johnson',
    role: 'Head of Operations',
    bio: 'Expert in HOA management with a focus on operational excellence and customer satisfaction.',
    image: 'https://randomuser.me/api/portraits/women/1.jpg'
  },
  {
    name: 'Michael Chen',
    role: 'Lead Developer',
    bio: 'Full-stack developer passionate about creating seamless user experiences.',
    image: 'https://randomuser.me/api/portraits/men/2.jpg'
  },
  {
    name: 'Emily Rodriguez',
    role: 'Community Manager',
    bio: 'Dedicated to building strong relationships between HOAs and service providers.',
    image: 'https://randomuser.me/api/portraits/women/2.jpg'
  }
];

const Team = () => {
  return (
    <SubpageTemplate
      title="Our Team"
      description="Meet the people behind our success"
      content={
        <>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member) => (
              <div key={member.name} className="text-center">
                <img 
                  className="mx-auto h-40 w-40 rounded-full object-cover" 
                  src={member.image} 
                  alt={member.name}
                />
                <h3 className="mt-4 text-lg font-medium text-gray-900">{member.name}</h3>
                <p className="text-sm font-medium text-indigo-600">{member.role}</p>
                <p className="mt-2 text-sm text-gray-500">{member.bio}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-12">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Our Values</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {[
                {
                  title: 'Integrity',
                  description: 'We believe in doing what\'s right, even when no one is watching.'
                },
                {
                  title: 'Innovation',
                  description: 'Continuously improving our platform to better serve our communities.'
                },
                {
                  title: 'Community',
                  description: 'Building strong, connected neighborhoods through better management.'
                }
              ].map((value) => (
                <div key={value.title} className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-base font-medium text-gray-900">{value.title}</h4>
                  <p className="mt-1 text-sm text-gray-500">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      }
    />
  );
};

export default Team;
