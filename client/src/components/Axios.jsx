import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { notification } from "antd";
import baseUrl from "./../api/axios";
import debounce from "lodash.debounce";

export default function Axios() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [users, setUsers] = useState([]);
  const [inputSearch, setInputSearch] = useState("");

  // Call API
  const loadData = () => {
    baseUrl
      .get(`users?email=${inputSearch}`)
      .then((response) => setUsers(response.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const delaySearch = debounce(loadData, 1000);
    delaySearch();

    // Hủy sự kiện search
    return delaySearch.cancel;
  }, [inputSearch]);

  // Submit form
  const handleSubmit = (e) => {
    // Ngặn chặn sự kiện mặc định của form
    e.preventDefault();

    // Tạo đối tượng user
    const user = {
      id: uuidv4(),
      user_name: userName,
      email: email,
      password: password,
    };

    // Gọi API thêm mới user
    baseUrl
      .post("users", user)
      .then((res) => {
        if (res.status === 201) {
          notification.success({
            message: "Thành công",
            description: "Thêm mới tài khoản thành công",
          });
        }
      })
      .catch((err) => {
        if (err.name === "AxiosError") {
          notification.error({
            message: "Cảnh báo",
            description: "Lỗi hệ thống",
          });
        }
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          onChange={(e) => setUserName(e.target.value)}
          value={userName}
          type="text"
          placeholder="Tên"
        />
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="text"
          placeholder="Email"
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="text"
          placeholder="Mật khẩu"
        />
        <textarea
          onChange={(e) => setAddress(e.target.value)}
          value={address}
          placeholder="Địa chỉ"
          cols="30"
          rows="10"
        ></textarea>
        <button>Submit</button>
      </form>

      <input
        onChange={(e) => setInputSearch(e.target.value)}
        value={inputSearch}
        type="text"
        placeholder="Tìm kiếm theo email"
      />

      <table border={1}>
        <thead>
          <tr>
            <th>STT</th>
            <th>UserName</th>
            <th>Email</th>
            <th>Password</th>
            <th colSpan={2}>Option</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>{user.user_name}</td>
              <td>{user.email}</td>
              <td>{user.password}</td>
              <td>
                <button>Sửa</button>
              </td>
              <td>
                <button>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
