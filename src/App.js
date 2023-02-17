import './App.css';
import { useState, useEffect } from "react";
import editIcon from "./images/edit-icon.png";
import deleteIcon from "./images/delete-icon.png"

//Idea for resizing inputs: have a O(1) dictionary with all the characters corresponding with it's pixel value. When a user types in the character, it will search through dictionary and add the pixel value of the character to the edit-input.

function App() {
  const [todos, setTodos] = useState(localStorage.getItem("Todos") !== null ? JSON.parse(localStorage.getItem("Todos")) : []);
  const [todoName, setTodoName] = useState("");
  const [editName, setEditName] = useState("");

  useEffect(() => {
    localStorage.setItem("Todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e) => {
    if (todoName !== "") {
      e.preventDefault();
      setTodos([...todos, {"name": todoName }]);
      document.getElementById("add-todo-input").value = "";
      setTodoName("");
    }
  };

  const deleteTodo = (e, index) => {
    e.preventDefault();
    setTodos(todos.filter((_, i) => i !== index));
  };

  const editTodo = (e, index) => {
    e.preventDefault();
    const cur_todos = [...todos];
    cur_todos[index] = {"name": editName};
    setTodos(cur_todos);
    e.target.setAttribute("contenteditable", "false");
    e.target.style.borderBottom = "none";
    e.target.style.marginBottom = "16px";
    document.getElementsByClassName("too-long-error")[index].textContent = "";
    e.target.textContent = editName;
    setEditName("");
  }; 

  const editTodoStart = (e, index, editTodoName) => {
    e.preventDefault();
    setEditName(editTodoName);
    const todo_p = document.getElementsByClassName("todo-name")[index];
    todo_p.setAttribute("contenteditable", "true");
    todo_p.focus();
    todo_p.style.borderBottom = "2px solid white";
  };

  const addTodoEnter = (e) => {
    if (e.keyCode === 13 && todoName !== "") {
      e.preventDefault();
      setTodos([...todos, {"name": todoName }]);
      e.target.value = "";
      setTodoName("");
    }
  };

  const editTodoEnter = (e, index) => {
    if (e.keyCode === 13 && editName !== "") {
      e.preventDefault();
      editTodo(e, index);
    } else if (e.target.textContent.length <= 30) {
      setEditName(e.target.textContent);
      e.target.style.borderBottom = "2px solid white";
      e.target.style.marginBottom = "16px";
      document.getElementsByClassName("too-long-error")[index].textContent = "";
    } else {
      e.target.style.borderBottom = "2px dashed rgb(241, 70, 104)";
      e.target.style.marginBottom = "0px";
      document.getElementsByClassName("too-long-error")[index].textContent = "Todo is too long!";
    }
  };

  return (
    <div className="App">
      <div className="todo-form">
        <p>Max todo length is 30 characters.</p>
        <input id="add-todo-input" className="add-todo-input" onChange={(e) => {setTodoName(e.target.value)}} onKeyUp={addTodoEnter} placeholder="Todo Name Here" maxLength="100"/>
        <button className="add-button" onClick={addTodo}>Add Todo</button>
      </div>
      <div className="todo-container">
        {
          todos.map((data, i) => 
            <div className="todo" key={i}>
              <div className= "edit-input">
                <p className="todo-name" onKeyUp={(e) => {editTodoEnter(e, i)}} onBlur={(e) => {editTodo(e, i)}}>{data.name}</p>
                <p className="too-long-error"></p>
              </div>
              <div className="edit-click" onClick={(e) => editTodoStart(e, i, data.name)}>
                <img src={editIcon} alt="Edit" className="edit-button"/>
              </div>
              <div className="delete-click" onClick={(e) => deleteTodo(e, i)}>
                <img src={deleteIcon} alt="X" className="delete-button"/>
              </div>
            </div>
          )
        }
      </div>
    </div>
  );
}

export default App;
