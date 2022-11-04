/* eslint-disable @typescript-eslint/ban-ts-comment */
import './App.css';
import HomePage from './pages/Home';
import Layout from './components/layout/Layout';

function App() {
  return (
    <Layout>
      <>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
        <HomePage />
      </>
    </Layout>
  );
}

export default App;
