import PropTypes from 'prop-types';

const PageContainer = ({ children, className = '' }) => {
  return (
    <div className={`min-h-screen bg-white dark:bg-gray-900 transition-colors ${className}`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
};

PageContainer.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default PageContainer;
