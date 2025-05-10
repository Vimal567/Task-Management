import './Task.css';
import moment from 'moment';

const Task = ({ task, openTaskModal, deleteTask, selectedTasksList, setSelectedTasksList }) => {

  const onFilterChange = (event) => {
    const { checked, value } = event.target;
    if (checked) {
      setSelectedTasksList((prev) => [...prev, value]);
    } else {
      setSelectedTasksList((prev) => prev.filter((item) => item !== value));
    }
  };

  const formatDate = (dateString) => {
    return moment(dateString).format('DD/MM/YYYY');
  };

  return (
    <div className='task-item'>
      <div className="actions-container">
        <input
          type="checkbox"
          name="select"
          id="select"
          value={task._id}
          checked={selectedTasksList.includes(task._id)}
          onChange={(event) => onFilterChange(event)}
        />
        <div>
          <button type="button" onClick={() => openTaskModal(task)}>
            <img src='/assets/edit-icon.svg' alt='edit task' />
          </button>
          <button type="button" onClick={() => deleteTask(task._id)}>
            <img src='/assets/delete-icon.svg' alt='delete task' />
          </button>
        </div>

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
        <div className="task-value">{task.days ? task.days : 0}</div>
      </div>
      <div className="task-details">
        <div className="task-label">Due date:</div>
        <div className="task-value">{formatDate(task.due)}</div>
      </div>
    </div>
  )
}

export default Task;