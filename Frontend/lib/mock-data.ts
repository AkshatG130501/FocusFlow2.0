import { RoadmapItem } from './types';

export const mockRoadmapData: RoadmapItem[] = [
  {
    id: "week1",
    title: "Week 1: Data Structures Fundamentals",
    description: "Master the essential data structures that form the foundation of efficient algorithms.",
    completed: false,
    duration: "7 days",
    topics: [
      {
        id: "arrays",
        title: "Arrays and Strings",
        description: "Understanding array operations, manipulation techniques, and common patterns.",
        completed: false
      },
      {
        id: "linked-lists",
        title: "Linked Lists",
        description: "Implementing singly and doubly linked lists with common operations and patterns.",
        completed: false
      },
      {
        id: "stacks-queues",
        title: "Stacks and Queues",
        description: "Understanding LIFO and FIFO data structures and their applications.",
        completed: false
      },
      {
        id: "hash-tables",
        title: "Hash Tables",
        description: "Implementing hash maps, handling collisions, and understanding time complexity.",
        completed: false
      }
    ]
  },
  {
    id: "week2",
    title: "Week 2: Advanced Data Structures",
    description: "Explore more complex data structures essential for coding interviews.",
    completed: false,
    duration: "7 days",
    topics: [
      {
        id: "trees",
        title: "Trees and Binary Trees",
        description: "Understanding tree structures, traversal methods, and binary trees.",
        completed: false
      },
      {
        id: "bst",
        title: "Binary Search Trees",
        description: "Implementing BSTs, operations, and understanding their properties.",
        completed: false
      },
      {
        id: "heaps",
        title: "Heaps and Priority Queues",
        description: "Understanding min/max heaps and implementing priority queues.",
        completed: false
      },
      {
        id: "graphs",
        title: "Graphs",
        description: "Understanding graph representations, traversals, and common algorithms.",
        completed: false
      }
    ]
  },
  {
    id: "week3",
    title: "Week 3: Algorithms and Techniques",
    description: "Master algorithmic approaches and problem-solving techniques.",
    completed: false,
    duration: "7 days",
    topics: [
      {
        id: "recursion",
        title: "Recursion and Dynamic Programming",
        description: "Understanding recursive approaches and memoization techniques.",
        completed: false
      },
      {
        id: "sorting",
        title: "Sorting and Searching",
        description: "Implementing and analyzing different sorting and searching algorithms.",
        completed: false
      },
      {
        id: "greedy",
        title: "Greedy Algorithms",
        description: "Understanding when and how to apply greedy approaches to problems.",
        completed: false
      },
      {
        id: "backtracking",
        title: "Backtracking",
        description: "Solving complex problems using backtracking and constraint satisfaction.",
        completed: false
      }
    ]
  },
  {
    id: "week4",
    title: "Week 4: System Design and Behavioral",
    description: "Prepare for system design and behavioral aspects of the Google interview.",
    completed: false,
    duration: "7 days",
    topics: [
      {
        id: "system-design",
        title: "System Design Basics",
        description: "Understanding key concepts and approaches to system design problems.",
        completed: false
      },
      {
        id: "design-patterns",
        title: "Object-Oriented Design",
        description: "Learning common design patterns and principles for OOD questions.",
        completed: false
      },
      {
        id: "behavioral",
        title: "Behavioral Questions",
        description: "Preparing for leadership, teamwork, and cultural fit questions.",
        completed: false
      },
      {
        id: "mock-interviews",
        title: "Mock Interviews",
        description: "Practice with realistic interview scenarios and get feedback.",
        completed: false
      }
    ]
  }
];