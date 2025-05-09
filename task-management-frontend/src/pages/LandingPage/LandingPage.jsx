import { useState } from 'react';
import './LandingPage.css';
import Modal from '../../components/Modal/Modal';

const LandingPage = () => {

  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const openExportModal = () => setShowExportModal(true);
  const closeExportModal = () => setShowExportModal(false);

  const openImportModal = () => setShowImportModal(true);
  const closeImportModal = () => setShowImportModal(false);

  const openDeleteModal = () => setShowDeleteModal(true);
  const closeDeleteModal = () => setShowDeleteModal(false);

  return (
    <div className='landing-page-section page-container'>
      <div className="tools-container">
        <button type="button" className='btn btn-primary' onClick={openExportModal}>Export Tasks</button>
        <button type="button" className='btn btn-primary' onClick={openImportModal}>Import Tasks</button>
        <button type="button" className='btn btn-primary'>Select All</button>
        <button type="button" className='btn btn-primary' onClick={openDeleteModal}>Delete Selected</button>
      </div>
      <div className="tasks-container">

      </div>

      <Modal show={showExportModal} onClose={closeExportModal}>
        <h4>Export Tasks</h4>
        <p>This is a simple modal example with Bootstrap styles in a React app.</p>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={closeExportModal}>Cancel</button>
          <button type="button" className="btn btn-success">Export</button>
        </div>
      </Modal>

      <Modal show={showImportModal} onClose={closeImportModal}>
        <h4>Import Tasks</h4>
        <p>This is a simple modal example with Bootstrap styles in a React app.</p>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={closeImportModal}>Cancel</button>
          <button type="button" className="btn btn-success">Import</button>
        </div>
      </Modal>

      <Modal show={showDeleteModal} onClose={closeDeleteModal}>
        <h4>Delete Tasks</h4>
        <p>Are you sure you want to delete the selected tasks?</p>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={closeDeleteModal}>No</button>
          <button type="button" className="btn btn-danger">Yes</button>
        </div>
      </Modal>
    </div>
  )
}

export default LandingPage;