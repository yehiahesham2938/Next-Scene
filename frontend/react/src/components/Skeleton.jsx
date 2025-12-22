import { motion } from 'framer-motion';

const Skeleton = ({ className = '', width = 'w-full', height = 'h-4' }) => {
  return (
    <div className={`relative overflow-hidden ${width} ${height} bg-gray-200 dark:bg-gray-700 rounded ${className}`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-gray-600/30 to-transparent"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: 'easeInOut',
        }}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
};

export default Skeleton;
