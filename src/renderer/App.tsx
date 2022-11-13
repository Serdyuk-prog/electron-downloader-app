import './App.css';
import { ToastContainer } from 'react-toastify';
import HomePage from './pages/Home';

import Layout from './components/layout/Layout';
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = (): JSX.Element => {
  return (
    <Layout>
      <>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
        <HomePage />
        <ToastContainer />
      </>
    </Layout>
  );
};

export default App;
