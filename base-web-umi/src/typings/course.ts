export enum CourseStatus {
    OPEN = "Đang mở",
    CLOSED = "Đã kết thúc",
    PAUSED = "Tạm dừng"
  }
  
  export interface Course {
    id: string;
    name: string;
    instructor: string;
    studentCount: number;
    description: string;
    status: CourseStatus;
  }