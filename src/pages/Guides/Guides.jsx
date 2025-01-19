import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import styles from './Guides.module.css';
import { connect } from 'react-redux';
import { fetchGuidesPaginated, getFavorites } from '../../actions/guides';
import { customStyles } from '../../components/CreatorsComponents/styles.Select';
import { KEYWORDS } from '../../components/CreatorsComponents/keyWords';
import { Link, useNavigate } from 'react-router-dom';

const GuideExplorer = (props) => {
  const {
    guidesListPaginated = [],
    totalGuides,
    fetchGuidesPaginated,
    getFavorites,
    userData,
  } = props;

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [keywordSearchQuery, setKeywordSearchQuery] = useState('');
  const [filterUserId, setFilterUserId] = useState(0);

  const navigate = useNavigate();
  const canLoadMore = guidesListPaginated.length < totalGuides;

  useEffect(() => {
    loadGuides(currentPage, filterUserId);
  }, [currentPage]);

  useEffect(() => {
    if (userData) {
      getFavorites(userData.id);
    }
  }, []);

  const loadGuides = async (page, user_id = 0, keywords = [], searchQuery = '', clearStore = false) => {
    try {
      await fetchGuidesPaginated(page, user_id, keywords, searchQuery, clearStore);
    } catch (error) {
      console.error('Ошибка при загрузке гайдов:', error);
    }
  };

  const handleKeywordSearch = () => {
    const keywords = selectedKeywords.map((keyword) => keyword.value).slice(0, 3);
    loadGuides(1, filterUserId, keywords, keywordSearchQuery, true);
    setCurrentPage(1);
  };

  const handleSelectGuide = (id) => {
    navigate(`/guides/${id}`); 
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.guides_container}>
        <h2>Your Guides</h2>
        <input
          type="text"
          className={styles.search_input}
          placeholder="Search guides by title..."
          value={keywordSearchQuery}
          onChange={(e) => setKeywordSearchQuery(e.target.value)}
        />

        <Select
          classNamePrefix="custom-select"
          styles={customStyles}
          options={KEYWORDS.map((keyword) => ({ value: keyword, label: keyword }))}
          onChange={setSelectedKeywords}
          value={selectedKeywords}
          placeholder="Select up to 3 themes"
          isMulti
          isClearable
        />

        {userData && (
          <label className={styles.show_favorites}>
            <input
              type="checkbox"
              checked={filterUserId === userData.id}
              onChange={(e) => setFilterUserId(e.target.checked ? userData.id : 0)}
            />
            <p>Show Favorites Only</p>
          </label>
        )}
        <div className={styles.btn_container}>
          <button type="button" onClick={handleKeywordSearch} className={styles.search_btn}>
            Search
          </button>
          {userData && (
            <Link to="/AiCreator" className={styles.search_btn}>
              AI Guide creator
            </Link>
          )}
        </div>

        <div className={styles.underline} />
      </div>

      <div className={styles.guides}>
        <div className={styles.guide_feed}>
          {Array.isArray(guidesListPaginated) &&
            guidesListPaginated.map((guide) => (
              <div
                key={guide.id}
                className={styles.guide_plate_img}
                style={{ backgroundImage: guide.prev_img ? `url(${guide.prev_img})` : 'none' }}
                onClick={() => handleSelectGuide(guide.id)} 
              >
                <div className={styles.guide_plate_prev}>
                  <h2 className={styles.guide_plate_title}>{guide.title}</h2>
                  <p className={styles.guide_plate_p}>{guide.description}</p>
                </div>
              </div>
            ))}
        </div>

        {canLoadMore && (
          <button
            type="button"
            className={styles.load_more_btn}
            onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
          >
            Load More Guides
          </button>
        )}
      </div>
    </div>
  );
};

const mapDispatchToProps = {
  fetchGuidesPaginated,
  getFavorites,
};

const mapStateToProps = (state) => ({
  guidesListPaginated: state.guidesReducer?.guidesListPaginated?.data || [],
  totalGuides: state.guidesReducer?.guidesListPaginated?.total || 0,
  userData: state.auth.userData,
});

export default connect(mapStateToProps, mapDispatchToProps)(GuideExplorer);
