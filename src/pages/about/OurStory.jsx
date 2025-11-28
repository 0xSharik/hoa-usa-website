import React from 'react';
import SubpageTemplate from '../subpages/SubpageTemplate';

const OurStory = () => {
  return (
    <SubpageTemplate
      title="Our Story"
      description="Discover the journey that brought us here"
      content={
        <>
          <p className="text-gray-700 mb-4">
            Founded in 2020, our journey began with a simple mission: to create a better way for homeowners and HOAs to connect with trusted service providers.
          </p>
          <h3 className="text-lg font-medium text-gray-900 mt-6 mb-2">Our Beginnings</h3>
          <p className="text-gray-600 mb-4">
            What started as a small team of real estate professionals and community managers has grown into a comprehensive platform serving thousands of communities nationwide.
          </p>
          <h3 className="text-lg font-medium text-gray-900 mt-6 mb-2">Our Mission</h3>
          <p className="text-gray-600">
            We're committed to making HOA management easier, more transparent, and more efficient for everyone involved.
          </p>
        </>
      }
    />
  );
};

export default OurStory;
