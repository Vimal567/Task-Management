import { Fragment, useEffect, useState } from 'react';
import './LandingPage.css';
import Modal from '../../components/Modal/Modal';
import { TRY_AGAIN, ENDPOINT } from '../../constants/constants';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import Task from '../../components/Task/Task';

const LandingPage = () => {

  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedTasksList, setSelectedTasksList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(null);

  // Open/Close Modal Handlers
  const openExportModal = () => setShowExportModal(true);
  const closeExportModal = () => setShowExportModal(false);

  const openImportModal = () => setShowImportModal(true);
  const closeImportModal = () => setShowImportModal(false);

  const openDeleteModal = () => setShowDeleteModal(true);
  const closeDeleteModal = () => setShowDeleteModal(false);

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
          {selectedTasksList.length > 0 && <button type="button" className='btn btn-primary' onClick={openDeleteModal}>Delete Selected</button>}
        </div>
        <div className="tasks-container">
          {tasks && tasks.map((task, index) => {
            return <Task
              task={task}
              key={index}
              deleteTask={deleteTask}
              selectedTasksList={selectedTasksList}
              setSelectedTasksList={setSelectedTasksList} />
          })}
          <div className="add-task-container">
            <img src='/assets/add-icon.svg' alt='add task' />
          </div>
        </div>

        {/* Import Modal */}
        <Modal show={showImportModal} onClose={closeImportModal}>
          <h4>Import Tasks</h4>
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
        <Modal show={showDeleteModal} onClose={closeDeleteModal}>
          <h4>Delete Tasks</h4>
          <p>Are you sure you want to delete the selected tasks?</p>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeDeleteModal}>No</button>
            <button type="button" className="btn btn-danger" onClick={() => deleteTask(selectedTasksList)} >Yes</button>
          </div>
        </Modal>

        {/* Task form Modal */}
        <Modal show={showExportModal} onClose={closeExportModal}>
          <h4>Export Tasks</h4>
          <p>This is a simple modal example with Bootstrap styles in a React app.</p>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeExportModal}>Cancel</button>
            <button type="button" className="btn btn-success">Export</button>
          </div>
        </Modal>
      </Fragment>}
    </div>
  )
}

export default LandingPage;
