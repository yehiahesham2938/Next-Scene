import Skeleton from './Skeleton';

const MovieCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm">
      {/* Poster Skeleton - 2:3 aspect ratio */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <Skeleton width="w-full" height="h-full" className="rounded-none" />
      </div>

      {/* Card Content */}
      <div className="p-3 space-y-2">
        {/* Title Skeleton */}
        <Skeleton width="w-4/5" height="h-4" className="rounded-md" />
        
        {/* Meta Info Skeleton (Year and Rating) */}
        <div className="flex items-center justify-between">
          <Skeleton width="w-12" height="h-3" className="rounded-md" />
          <Skeleton width="w-16" height="h-3" className="rounded-md" />
        </div>
      </div>
    </div>
  );
};

const MovieGridSkeleton = ({ count = 10 }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <MovieCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default MovieGridSkeleton;
