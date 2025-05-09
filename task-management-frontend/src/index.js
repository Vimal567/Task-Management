import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { SnackbarProvider } from "notistack";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <SnackbarProvider
    maxSnack={1}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
  >
    <App />
  </SnackbarProvider>
);
