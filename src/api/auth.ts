// Auth API service
export interface User {
  id: string;
  displayName: string;
  email: string;
  role: 'student' | 'staff' | 'admin' | 'super_admin';
  campus: string;
  memberSince: string;
  lastLogin: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    await delay(1000);

    // Simulate API call - in real app, this would be:
    // return fetch('/api/auth/login', { method: 'POST', body: JSON.stringify(credentials) })
    //   .then(res => res.json());

    // Mock response based on email
    if (credentials.email === 'admin@rvrjce.ac.in') {
      return {
        user: {
          id: 'user-001',
          displayName: 'Admin User',
          email: 'admin@rvrjce.ac.in',
          role: 'admin',
          campus: 'RVRJC College of Engineering',
          memberSince: 'January 2023',
          lastLogin: 'Today, 10:30 AM'
        },
        token: 'mock-jwt-token-admin'
      };
    } else if (credentials.email === 'staff@rvrjce.ac.in') {
      return {
        user: {
          id: 'user-002',
          displayName: 'Staff User',
          email: 'staff@rvrjce.ac.in',
          role: 'staff',
          campus: 'RVRJC College of Engineering',
          memberSince: 'March 2024',
          lastLogin: 'Today, 09:15 AM'
        },
        token: 'mock-jwt-token-staff'
      };
    } else {
      // Default student
      return {
        user: {
          id: 'user-003',
          displayName: 'Megha Janga',
          email: credentials.email,
          role: 'student',
          campus: 'RVRJC College of Engineering',
          memberSince: 'March 2024',
          lastLogin: 'Today, 10:30 AM'
        },
        token: 'mock-jwt-token-student'
      };
    }
  },

  logout: async (): Promise<void> => {
    await delay(500);
    // In real app: return fetch('/api/auth/logout', { method: 'POST' });
    return Promise.resolve();
  },

  getCurrentUser: async (): Promise<User | null> => {
    await delay(500);
    // In real app, this would check token and fetch user data
    // For now, return mock data
    return {
      id: 'user-003',
      displayName: 'Megha Janga',
      email: 'megha.janga@rvrjce.ac.in',
      role: 'student',
      campus: 'RVRJC College of Engineering',
      memberSince: 'March 2024',
      lastLogin: 'Today, 10:30 AM'
    };
  }
};