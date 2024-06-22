import "./App.css";
import { Outlet } from "react-router-dom";
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default App;
