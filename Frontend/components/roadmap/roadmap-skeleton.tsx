import { motion } from "framer-motion";

export default function RoadmapSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <motion.div 
          key={i}
          className="bg-card rounded-lg shadow-sm border border-border/50 p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center">
                <div className="h-5 w-5 rounded-full bg-muted animate-pulse mr-2"></div>
                <div className="h-6 bg-muted animate-pulse rounded w-48"></div>
              </div>
              <div className="h-4 bg-muted animate-pulse rounded w-64 mt-2 ml-7"></div>
            </div>
            
            <div className="flex items-center space-x-4 ml-7 sm:ml-0">
              <div className="h-4 bg-muted animate-pulse rounded w-24"></div>
              <div className="h-2 bg-muted animate-pulse rounded-full w-32"></div>
              <div className="h-6 w-6 bg-muted animate-pulse rounded"></div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}