import React from 'react';

function Dashboard() {
  return (
    <div>
      <div class="planner-app">
          <h2>Add New Tasks</h2>
          <div class="row">
            <input type="text" name="newTast" value="Add a New Task"></input>
            <button>Add</button>
          </div>
          <ul id="list-container">
            <li class="checked">Task 1</li>
            <li>Task 2</li>
            <li>Task 3</li>
          </ul>
      </div> 
    </div>
  );
}

export default Dashboard;