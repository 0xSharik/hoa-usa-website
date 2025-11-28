import React from 'react';
import { Link } from 'react-router-dom';
import SubpageLayout from '../subpages/SubpageLayout';

const NewsletterArchive = () => {
  const newsletters = [
    {
      id: 'fall-2023',
      title: 'Fall 2023 Community Update',
      excerpt: 'Quarterly updates, upcoming events, and important announcements for the fall season.',
      date: 'September 1, 2023',
      issue: 'Issue #12'
    },
    {
      id: 'summer-2023',
      title: 'Summer 2023 Highlights',
      excerpt: 'A look back at community events, achievements, and summer activities.',
      date: 'June 1, 2023',
      issue: 'Issue #11'
    },
    {
      id: 'spring-2023',
      title: 'Spring 2023 Newsletter',
      excerpt: 'Welcome spring with our latest community news and seasonal updates.',
      date: 'March 1, 2023',
      issue: 'Issue #10'
    }
  ];

  return (
    <SubpageLayout 
      title="Newsletter Archive"
      description="Browse past issues of our community newsletter"
    >
      <div className="space-y-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {newsletters.map((newsletter) => (
              <li key={newsletter.id} className="hover:bg-gray-50">
                <Link to={`/resources/newsletter/${newsletter.id}`} className="block">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        {newsletter.title}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {newsletter.issue}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {newsletter.excerpt}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>{newsletter.date}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-indigo-50 p-4 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-indigo-800">Subscribe to our newsletter</h3>
              <div className="mt-2 text-sm text-indigo-700">
                <p>Get the latest updates and news delivered to your inbox.</p>
              </div>
              <div className="mt-4">
                <Link to="/newsletter/subscribe" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  Subscribe now <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SubpageLayout>
  );
};

export default NewsletterArchive;
