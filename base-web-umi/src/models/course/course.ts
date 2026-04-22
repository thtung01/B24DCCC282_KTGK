import { useState, useEffect } from "react";
import {
  getCourses,
  createCourse,
  deleteCourse,
  updateCourse 
} from "../../services/course/course";

import { Course } from "../../typings/course";

export default function useCourseModel() {
  const [data, setData] = useState<Course[]>([]);
  const [keyword, setKeyword] = useState("");
  const [instructor, setInstructor] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await getCourses();
    setData(res);
  };

  const add = async (course: Course) => {
    if (!course.name.trim()) throw new Error("Không được trống");
    if (course.name.length > 100) throw new Error("Max 100 ký tự");
    if (course.studentCount < 0) {
      throw new Error("Số học viên không được âm");
    }

    const isExist = data.some(
      c => c.name.toLowerCase() === course.name.toLowerCase()
    );

    if (isExist) throw new Error("Trùng tên");

    await createCourse(course);
    fetchData();
  };

  const update = async (course: Course) => {
    if (!course.name.trim()) throw new Error("Không được trống");
    if (course.name.length > 100) throw new Error("Max 100 ký tự");
    if (course.studentCount < 0) {
      throw new Error("Số học viên không được âm");
    }

    const isDuplicate = data.some(
      c =>
        c.name.toLowerCase() === course.name.toLowerCase() &&
        c.id !== course.id
    );

    if (isDuplicate) throw new Error("Trùng tên");

    await updateCourse(course); // 🔥 gọi service
    fetchData();
  };

  const remove = async (course: Course) => {
    if (course.studentCount > 0) {
      alert("Không thể xóa khóa đã có học viên");
      return;
    }

    if (!window.confirm("Bạn có chắc muốn xóa?")) return;

    await deleteCourse(course.id);
    fetchData();
  };

  const list = data
    .filter(c =>
      c.name.toLowerCase().includes(keyword.toLowerCase())
    )
    .filter(c =>
      instructor
        ? c.instructor.toLowerCase().includes(instructor.toLowerCase())
        : true
    )
    .filter(c =>
      status ? c.status === status : true
    )
    .sort((a, b) => b.studentCount - a.studentCount);

  return {
    list,
    setKeyword,
    setInstructor,
    setStatus,
    add,
    update, // 🔥 thêm dòng này
    remove
  };
}