import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Preloader from '../../components/Preloader/Preloader';
import Dashboard from '../Dashboard/Dashboard';
import PageNotFound from '../PageNotFound/PageNotFound';

import styles from './App.module.css';

function App(props) {
  const { isFetching } = props;

  return (
    <div className={styles.wrapper}>
      {isFetching && <Preloader />}
      <Toaster />
      <Header />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
