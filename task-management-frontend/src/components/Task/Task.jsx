import './Task.css';

const Task = ({ task, deleteTask }) => {
  return (
    <div className='task-item'>
      <div className="actions-container">
        <input type="checkbox" name="select" id="select" />
        <button type="button" onClick={() => deleteTask(task._id)}>
          <img src='/assets/delete-icon.svg' alt='delete task' />
        </button>
      </div>
      <div className="task-details">
        <div className="task-label">Title:</div>
        <div className="task-value">{task.title}</div>
      </div>
      <div className="task-details">
        <div className="task-label">Description:</div>
        <div className="task-value">{task.description}</div>
      </div>
      <div className="task-details">
        <div className="task-label">Days:</div>
        <div className="task-value">{task.days}</div>
      </div>
      <div className="task-details">
        <div className="task-label">Due date:</div>
        <div className="task-value">{task.due}</div>
      </div>
    </div>
  )
}

export default Task;