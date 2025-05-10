import { Fragment, useEffect, useState } from 'react';
import './LandingPage.css';
import Modal from '../../components/Modal/Modal';
import { TRY_AGAIN, ENDPOINT, REQUIRED_FIELDS } from '../../constants/constants';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import Task from '../../components/Task/Task';
import moment from 'moment';

const LandingPage = () => {

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedTasksList, setSelectedTasksList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [taskEntry, setTaskEntry] = useState({
    title: '',
    description: '',
    days: 0,
    due: ''
  });

  // Modal hooks
  const [showImportModal, setShowImportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  // Open/Close Modal Handlers
  const openImportModal = () => setShowImportModal(true);
  const closeImportModal = () => setShowImportModal(false);

  const openDeleteModal = () => setShowDeleteModal(true);
  const closeDeleteModal = () => setShowDeleteModal(false);

  const openTaskModal = (data) => {
    if (data) {
      const formattedDueDate = moment(data.due).isValid()
        ? moment(data.due).format('YYYY-MM-DD')
        : '';  // Set empty string if invalid date

      setTaskEntry({
        _id: data._id,
        title: data.title,
        description: data.description,
        days: data.days,
        due: formattedDueDate,
      });
    }
    setShowTaskModal(true);
  };

  const closeTaskModal = () => {
    setTaskEntry({
      title: '',
      description: '',
      days: 0,
      due: '',
    });
    setShowTaskModal(false);
  };

  const { enqueueSnackbar } = useSnackbar();

  const getTasks = async () => {
    setIsLoading(true);
    try {
      const accountId = localStorage.getItem('id');
      const response = await axios.get(ENDPOINT + 'task/getTasks/' + accountId, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = response.data;
      setTasks(data.tasks);
    } catch (error) {
      setIsLoading(false);
      enqueueSnackbar(TRY_AGAIN, { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async (selectedIds) => {
    setIsLoading(true);
    const payload = {
      task_id: Array.isArray(selectedIds) ? selectedIds : [selectedIds]
    };

    try {
      await axios.post(ENDPOINT + 'task/deleteTasks', payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setSelectedTasksList([]);
      closeDeleteModal();
      getTasks();
    } catch (error) {
      setIsLoading(false);
      enqueueSnackbar(TRY_AGAIN, { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const exportTasks = async () => {
    setIsLoading(true);
    try {
      const accountId = localStorage.getItem('id');

      const response = await axios.get(`${ENDPOINT}task/exportTasks/${accountId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        responseType: 'blob', //file is sent from BE
      });

      // Create a Blob URL
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob); // Create an object URL for the blob

      // Create a temporary anchor element for downloading the file
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'tasks.xlsx'); // Specify the filename

      // Programmatically click the link to trigger the download
      link.click();

      // Clean up by revoking the object URL after the download is initiated
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setIsLoading(false);
      enqueueSnackbar(TRY_AGAIN, { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };


  // Handle file selection
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files); // Convert FileList to an array
    setSelectedFiles(files);
  };

  // Handle file import
  const handleFileUpload = async () => {
    if (selectedFiles.length === 0) {
      alert('Please select files to upload');
      return;
    }

    closeImportModal();
    setIsLoading(true);
    const formData = new FormData();

    selectedFiles.forEach(file => {
      formData.append('file', file);
    });

    try {
      const accountId = localStorage.getItem('id');
      const response = await axios.post(`${ENDPOINT}task/importTasks/${accountId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 201) {
        enqueueSnackbar('Files uploaded successfully!', { variant: 'success' });
      } else {
        setIsLoading(false);
        enqueueSnackbar('Error uploading files', { variant: 'error' });
      }
      getTasks();
    } catch (error) {
      setIsLoading(false);
      enqueueSnackbar('Error uploading files', { variant: 'error' });
    }
  };

  const handleSelectAll = () => {
    const allTaskIds = tasks.map(task => task._id);
    setSelectedTasksList(allTaskIds);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskEntry(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleTaskForm = async (e) => {
    e.preventDefault();

    if (!taskEntry.title || !taskEntry.due) {
      enqueueSnackbar(REQUIRED_FIELDS, { variant: 'warning' });
      return;
    }

    setIsLoading(true);

    const accountId = localStorage.getItem('id');
    const taskData = {
      title: taskEntry.title,
      description: taskEntry.description,
      days: taskEntry.days,
      due: moment(taskEntry.due).endOf('day').toISOString(),
      account_id: accountId
    };

    try {
      let response;

      if (taskEntry._id) {
        // If taskEntry has an _id, it's an update
        await axios.patch(`${ENDPOINT}task/updateTask/${taskEntry._id}`, taskData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        enqueueSnackbar("Task updated successfully!", { variant: 'success' });
      } else {
        // If no _id, create a new task
        await axios.post(`${ENDPOINT}task/create`, taskData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        enqueueSnackbar("Task added successfully!", { variant: 'success' });
      }

      setTaskEntry({
        title: '',
        description: '',
        days: 0,
        due: '',
      });

      closeTaskModal();
      getTasks();
    } catch (error) {
      enqueueSnackbar("Error saving task", { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setToken(token);
    }
  }, []);

  useEffect(() => {
    if (token) {
      getTasks();
    }
  }, [token]);


  return (
    <div className='landing-page-section page-container'>
      {isLoading ? <div className='loading-container'>Loading Please wait...</div> : <Fragment>
        <div className="tools-container">
          <button type="button" className='btn btn-primary' onClick={exportTasks}>Export Tasks</button>
          <button type="button" className='btn btn-primary' onClick={openImportModal}>Import Tasks</button>
          <button type="button" className='btn btn-primary' onClick={handleSelectAll}>Select All</button>
          {selectedTasksList.length > 0 && <button type="button" className='btn btn-danger' onClick={openDeleteModal}>Delete Selected</button>}
          <button type="button" className='btn btn-success' onClick={() => openTaskModal(false)}>Add Task</button>
        </div>
        <div className="tasks-container">
          {tasks && tasks.map((task, index) => {
            return <Task
              task={task}
              key={index}
              openTaskModal={openTaskModal}
              deleteTask={deleteTask}
              selectedTasksList={selectedTasksList}
              setSelectedTasksList={setSelectedTasksList} />
          })}
          <div className="add-task-container" onClick={openTaskModal}>
            <img src='/assets/add-icon.svg' alt='add task' />
          </div>
        </div>

        {/* Import Modal */}
        <Modal heading={"Import tasks"} show={showImportModal} onClose={closeImportModal}>
          <p>Please select one or more CSV/Excel files to import:</p>

          <div className="mb-3">
            <label htmlFor="task-files" className="form-label">Choose Files</label>
            <input
              type="file"
              id="task-files"
              className="form-control"
              multiple
              accept=".csv, .xls, .xlsx"
              onChange={handleFileChange}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeImportModal}>Cancel</button>
            <button type="button" className="btn btn-success" onClick={handleFileUpload}>Import</button>
          </div>
        </Modal>

        {/* Delete Modal */}
        <Modal heading={"Delete tasks"} show={showDeleteModal} onClose={closeDeleteModal}>
          <p>Are you sure you want to delete the selected tasks?</p>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeDeleteModal}>No</button>
            <button type="button" className="btn btn-danger" onClick={() => deleteTask(selectedTasksList)} >Yes</button>
          </div>
        </Modal>

        {/* Task form Modal */}
        <Modal heading={"Add/Update task"} show={showTaskModal} onClose={closeTaskModal}>
          <form>
            <div className="form-group">
              <label htmlFor="title">Title*</label>
              <input
                className='form-control'
                type="text"
                name="title"
                id="title"
                value={taskEntry.title}
                onChange={handleChange}
                placeholder='Enter your email'
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input
                className='form-control'
                type="text-area"
                name="description"
                id="description"
                value={taskEntry.description}
                onChange={handleChange}
                placeholder='Enter description'
              />
            </div>

            <div className="form-group">
              <label htmlFor="days">Days</label>
              <input
                className='form-control'
                type="number"
                name="days"
                id="days"
                value={taskEntry.days}
                onChange={handleChange}
                placeholder='Enter days'
              />
            </div>

            <div className="form-group">
              <label htmlFor="due">Due date*</label>
              <input
                className='form-control'
                type="date"
                name="due"
                id="due"
                value={taskEntry.due}
                onChange={handleChange}
                placeholder='Enter due date'
              />
            </div>
          </form>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeTaskModal}>Cancel</button>
            <button type="submit" className="btn btn-success" onClick={handleTaskForm}>Save</button>
          </div>
        </Modal>
      </Fragment>}
    </div>
  )
}

export default LandingPage;
