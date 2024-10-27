import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { Toaster } from 'react-hot-toast';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      <ToastContainer position="bottom-center" autoClose={2000} hideProgressBar={true} />
      <Header />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="*" element={<PageNotFound />} />
       
      </Routes>
      
      <Footer />
    </div>
  );
}

const mapStateToProps = (store) => ({
  isFetching: store.preloader.isFetching,
  userData: store.auth.userData,
});

export default connect(mapStateToProps)(App);
