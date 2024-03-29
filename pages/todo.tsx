import axios from "@/lib/axios";
import { useEffect, useState } from "react";

export default function Todo() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [todoid, setTodoId] = useState("");
  useEffect(() => {
    fetchTodos();
  }, []);

  const titleChange = (e) => {
    setTitle(e.target.value);
  };
  const submitForm = (e) => {
    e.preventDefault();
    //console.log(title);
    var formData = new FormData();
    formData.append("title", title);
    formData.append("is_done", 0);

    let url = "api/todos";

    if (todoid != "") {
      url = "api/todos/" + todoid;
      formData.append("_method", "PUT");
    }

    axios.post(url, formData).then((response) => {
      setTitle("");
      fetchTodos();
      setTodoId("");
    });
  };

  function editTodo(id) {
    //console.log(id);
    setTodoId(id);
    todos.map((item) => {
      if (item.id == id) {
        setTitle(item.title);
      }
    });
  }

  function deleteTodo(id) {
    let params = { _method: "delete" };
    axios.post("/api/todos/" + id, params).then((response) => {
      setTitle("");
      fetchTodos();
      setTodoId("");
    });
  }

  function isDoneTodo(id, is_done) {
    let params = { is_done: !is_done };
    axios.post("/api/todos/done/" + id, params).then((response) => {
      setTitle("");
      fetchTodos();
      setTodoId("");
    });
  }

  function fetchTodos() {
    axios.get("/api/todos/").then((response) => {
      //console.log(Response);
      setTodos(response.data);
    });
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 sm:p-8 lg:p-24">
      <div className="max-w-md w-full mx-auto">
        <h1 className="text-3xl mb-4">ToDo App</h1>

        <form className="space-y-4" method="POST" onSubmit={submitForm}>
          <div>
            <label
              htmlFor="task"
              className="block text-sm font-medium text-gray-700"
            >
              Task:
            </label>
            <input
              value={title}
              name="title"
              type="text"
              id="task"
              onChange={titleChange}
              className="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
          >
            Save
          </button>
        </form>

        <table className="table-auto border">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4"></th>
              <th className="py-2 px-4">Sl.No</th>
              <th className="py-2 px-4">Title</th>
              <th className="py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {todos &&
              todos.map((item, i) => (
                <tr key={i} className={item.is_done ? "line-through" : ""}>
                  <td className="py-2 px-4">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-blue-500 border-2 border-gray-300 rounded checked:bg-blue-500 checked:border-transparent"
                      checked={item.is_done}
                      onChange={() => isDoneTodo(item.id, item.is_done)}
                    />
                  </td>
                  <td className="py-2 px-4">{i + 1}</td>
                  <td className="py-2 px-4">{item.title}</td>
                  <td className="py-2 px-4">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-full mr-2"
                      onClick={() => editTodo(item.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-full"
                      onClick={() => deleteTodo(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            <tr>
              <td className="py-2 px-4"></td>
              <td className="py-2 px-4"></td>
              <td className="py-2 px-4"></td>
              <td className="py-2 px-4"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}
