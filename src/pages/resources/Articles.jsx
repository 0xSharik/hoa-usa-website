import React from 'react';
import { Link } from 'react-router-dom';
import SubpageLayout from '../subpages/SubpageLayout';

const Articles = () => {
  const articles = [
    {
      id: 1,
      title: '10 Essential HOA Management Tips',
      excerpt: 'Learn the top strategies for effective HOA management and community engagement.',
      category: 'Management',
      date: 'October 15, 2023',
      readTime: '5 min read'
    },
    {
      id: 2,
      title: 'Financial Planning for HOAs',
      excerpt: 'A comprehensive guide to budgeting and financial planning for homeowners associations.',
      category: 'Finance',
      date: 'October 5, 2023',
      readTime: '7 min read'
    },
    {
      id: 3,
      title: 'Maintaining Common Areas',
      excerpt: 'Best practices for keeping shared spaces clean, safe, and well-maintained.',
      category: 'Maintenance',
      date: 'September 28, 2023',
      readTime: '4 min read'
    }
  ];

  return (
    <SubpageLayout 
      title="Articles"
      description="Browse our collection of informative articles on HOA management and community living"
    >
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <div key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <span className="inline-block px-3 py-1 text-sm font-semibold text-indigo-800 bg-indigo-100 rounded-full mb-2">
                  {article.category}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{article.title}</h3>
                <p className="text-gray-600 mb-4">{article.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{article.date}</span>
                  <span>{article.readTime}</span>
                </div>
                <div className="mt-4">
                  <Link 
                    to={`/resources/articles/${article.id}`} 
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Read more →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SubpageLayout>
  );
};

export default Articles;
