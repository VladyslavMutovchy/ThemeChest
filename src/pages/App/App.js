import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';

import { getRoleFromToken } from '../../utils/functions';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Preloader from '../../components/Preloader/Preloader';
import Main from '../Main/Main';
import PageNotFound from '../PageNotFound/PageNotFound';
import Profile from '../Profile/Profile';
import styles from './App.module.css';
import Creator from '../Creator/Creator';
import Guides from '../Guides/Guides';
import AdminList from '../AdminList/AdminList';
import AiCreator from '../AiCreator/AiCreator';
import GuideDetails from '../Guides/GuideDetails';


function App(props) {
  const { isFetching } = props;
  const userData = useSelector((state) => state.auth.userData);

  const role = userData?.token ? getRoleFromToken(userData.token) : null;
  return (
    <div className={styles.wrapper}>
      {isFetching && <Preloader />}
      <ToastContainer position="bottom-center" autoClose={2000} hideProgressBar={true} />
      <Header />
      <Routes>
        {userData ? <Route path="/profile" element={<Profile />} /> : null}
        {userData ? <Route path="/creator" element={<Creator />} /> : null}
        {role === 1 ? <Route path="/admin_list" element={<AdminList />} /> : null}
        {userData ? <Route path="/AiCreator" element={<AiCreator />} /> : null}
        <Route path="/" element={<Main />} />
        <Route path="/guides" element={<Guides />} />
        <Route path="/guides/:id" element={<GuideDetails />} />
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
