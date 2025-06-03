export interface Task {
  id: string;
  created_at: string;
  title: string;
  description?: string;
  is_completed: boolean;
  user_id: string;
}

export interface User {
  id: string;
  created_at: string;
  email: string;
  name?: string;
}
