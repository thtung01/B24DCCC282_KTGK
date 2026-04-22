import { Course, CourseStatus } from "../../typings/course";

const STORAGE_KEY = "courses";

function loadData(): Course[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) return JSON.parse(data);

  return [
    {
      id: "1",
      name: "React cơ bản",
      instructor: "Nguyễn Thanh Tùng",
      studentCount: 12,
      description: "",
      status: CourseStatus.OPEN
    },
    {
      id: "2",
      name: "React nâng cao",
      instructor: "Nguyễn Văn Hiếu",
      studentCount: 25,
      description: "",
      status: CourseStatus.OPEN
    },
    {
      id: "3",
      name: "NodeJS API",
      instructor: "Trần Đình Nhân",
      studentCount: 40,
      description: "",
      status: CourseStatus.CLOSED
    },
    {
      id: "4",
      name: "TypeScript từ A-Z",
      instructor: "Lê Văn Luyện",
      studentCount: 10,
      description: "",
      status: CourseStatus.PAUSED
    },
    {
      id: "5",
      name: "HTML CSS cơ bản",
      instructor: "Trần Văn Bảo",
      studentCount: 9,
      description: "",
      status: CourseStatus.OPEN
    }
  ];
}

function saveData(data: Course[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

let courses: Course[] = loadData();

export async function getCourses() {
  return courses;
}
export async function updateCourse(course: Course) {
    courses = courses.map(c => (c.id === course.id ? course : c));
    saveData(courses);
    return course;
  }

export async function createCourse(course: Course) {
  courses.push(course);
  saveData(courses); 
  return course;
}

export async function deleteCourse(id: string) {
  courses = courses.filter(c => c.id !== id);
  saveData(courses); 
  return true;
}