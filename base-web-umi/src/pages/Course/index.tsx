import useCourseModel from "../../models/course/course";
import { useState } from "react";
import { CourseStatus } from "../../typings/course";

export default function CoursePage() {
  const {
    list,
    setKeyword,
    setInstructor,
    setStatus,
    add,
    remove,
    update
  } = useCourseModel();

  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    instructor: "",
    studentCount: 0,
    description: "",
    status: CourseStatus.OPEN
  });

  const [instructors, setInstructors] = useState<string[]>([
    "Nguyễn Thanh Tùng",
    "Nguyễn Văn Hiếu",
    "Trần Đình Nhân",
    "Lê Văn Luyện",
    "Trần Văn Bảo"
  ]);

  const submit = async () => {
    try {
      // thêm instructor mới vào list
      if (
        form.instructor &&
        !instructors.some(
          i => i.toLowerCase() === form.instructor.toLowerCase()
        )
      ) {
        setInstructors(prev => [...prev, form.instructor]);
      }

      if (editingId) {
        await update({
          ...form,
          id: editingId
        });
        setEditingId(null);
      } else {
        await add({
          ...form,
          id: Date.now().toString()
        });
      }

      setForm({
        name: "",
        instructor: "",
        studentCount: 0,
        description: "",
        status: CourseStatus.OPEN
      });
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ marginBottom: 20 }}>Course Manager</h2>

      {/* FILTER */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input
          placeholder="Tìm kiếm khoá học"
          onChange={e => setKeyword(e.target.value)}
          style={{ padding: 8, flex: 1 }}
        />

        <input
          placeholder="Giảng viên"
          onChange={e => setInstructor(e.target.value)}
          style={{ padding: 8 }}
        />

        <select
          onChange={e => setStatus(e.target.value)}
          style={{ padding: 8 }}
        >
          <option value="">All</option>
          <option value={CourseStatus.OPEN}>Đang mở</option>
          <option value={CourseStatus.CLOSED}>Đã kết thúc</option>
          <option value={CourseStatus.PAUSED}>Tạm dừng</option>
        </select>
      </div>

      {/* FORM */}
      <div
        style={{
          border: "1px solid #ddd",
          padding: 15,
          marginBottom: 20,
          borderRadius: 8
        }}
      >
        <h4>
          {editingId ? "Cập nhật khóa học" : "➕ Thêm khóa học"}
        </h4>

        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        <input
          placeholder="Tên khóa học"
          value={form.name}
          maxLength={100} 
          onChange={e => {
            const value = e.target.value;

            if (value.length <= 100) {
              setForm({ ...form, name: value });
            }
          }}
          style={{ padding: 8, flex: 1 }}
        />

          {/* instructor */}
          <input
            list="instructor-list"
            placeholder="Giảng viên"
            value={form.instructor}
            onChange={e =>
              setForm({ ...form, instructor: e.target.value })
            }
            style={{ padding: 8 }}
          />

          <datalist id="instructor-list">
            {instructors.map(i => (
              <option key={i} value={i} />
            ))}
          </datalist>

          <input
            type="number"
            min={0}
            placeholder="Số HV"
            value={form.studentCount}
            onChange={e => {
              const value = Number(e.target.value);
              setForm({
                ...form,
                studentCount: value < 0 ? 0 : value
              });
            }}
            style={{ padding: 8, width: 100 }}
          />

          {/* 🔥 DESCRIPTION */}
          <input
            placeholder="Mô tả"
            value={form.description}
            onChange={e =>
              setForm({ ...form, description: e.target.value })
            }
            style={{ padding: 8, flex: 1 }}
          />

          {/* STATUS */}
          <select
            value={form.status}
            onChange={e =>
              setForm({
                ...form,
                status: e.target.value as CourseStatus
              })
            }
            style={{ padding: 8 }}
          >
            <option value={CourseStatus.OPEN}>Đang mở</option>
            <option value={CourseStatus.CLOSED}>Đã kết thúc</option>
            <option value={CourseStatus.PAUSED}>Tạm dừng</option>
          </select>

          <button
            onClick={submit}
            style={{
              background: editingId ? "green" : "#1890ff",
              color: "#fff",
              border: "none",
              padding: "8px 16px",
              borderRadius: 4
            }}
          >
            {editingId ? "Cập nhật" : "Thêm"}
          </button>
        </div>
      </div>

      {/* TABLE */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#fff"
        }}
      >
        <thead>
          <tr style={{ background: "#f5f5f5" }}>
            <th style={th}>Tên</th>
            <th style={th}>Giảng viên</th>
            <th style={th}>Số HV</th>
            <th style={th}>Mô tả</th>
            <th style={th}>Trạng thái</th>
            <th style={th}>Action</th>
          </tr>
        </thead>

        <tbody>
          {list.map(c => (
            <tr key={c.id}>
              <td style={td}>{c.name}</td>
              <td style={td}>{c.instructor}</td>
              <td style={td}>{c.studentCount}</td>

              {/* description */}
            <td
                style={{
                    ...td,
                    maxWidth: 200,
                    whiteSpace: "normal",
                    wordBreak: "break-word"
                }}
            >
                {c.description}
            </td>

              <td style={td}>
                <span
                  style={{
                    padding: "4px 8px",
                    borderRadius: 4,
                    background:
                      c.status === CourseStatus.OPEN
                        ? "#d9f7be"
                        : c.status === CourseStatus.CLOSED
                        ? "#ffd6e7"
                        : "#ffe58f"
                  }}
                >
                  {c.status}
                </span>
              </td>

              <td style={td}>
                <button
                  onClick={() => {
                    setForm({
                      name: c.name,
                      instructor: c.instructor,
                      studentCount: c.studentCount,
                      description: c.description,
                      status: c.status
                    });
                    setEditingId(c.id);
                  }}
                  style={{
                    background: "orange",
                    color: "#fff",
                    border: "none",
                    padding: "4px 10px",
                    borderRadius: 4,
                    marginRight: 5
                  }}
                >
                  Sửa
                </button>

                <button
                  onClick={() => remove(c)}
                  style={{
                    background: "red",
                    color: "#fff",
                    border: "none",
                    padding: "4px 10px",
                    borderRadius: 4
                  }}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th = {
  border: "1px solid #ddd",
  padding: 10,
  textAlign: "left" as const
};

const td = {
  border: "1px solid #ddd",
  padding: 10
};