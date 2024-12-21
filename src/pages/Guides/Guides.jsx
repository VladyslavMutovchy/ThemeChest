import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import styles from './Guides.module.css';
import { connect } from 'react-redux';
import { fetchGuidesPaginated, getFavorites, addToFavorites, removeFromFavorites } from '../../actions/guides';
import { customStyles } from '../../components/CreatorsComponents/styles.Select';
import { KEYWORDS } from '../../components/CreatorsComponents/keyWords';
import { getGuideChapters } from '../../actions/creator';
import PreviewGuide from '../../components/CreatorsComponents/PreviewGuide';

const GuideExplorer = (props) => {
  const {
    guidesListPaginated = [],
    totalGuides,
    getGuideChapters,
    getFavorites,
    fetchGuidesPaginated,
    chaptersByGuide,
    addToFavorites,
    favorites,
    removeFromFavorites,
    userData,
  } = props;

  const [targetGuideTitle, setTargetGuideTitle] = useState(null);
  const [targetGuide, setTargetGuide] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [keywordSearchQuery, setKeywordSearchQuery] = useState('');

  const [filterUserId, setFilterUserId] = useState(0);

  const canLoadMore = guidesListPaginated.length < totalGuides;

  useEffect(() => {
    loadGuides(currentPage, filterUserId);
  }, [currentPage]);

  useEffect(() => {
    if (userData) {
      getFavorites(userData.id);
    }
  }, [targetGuide]);

  const loadGuides = async (page, user_id = 0, keywords = [], searchQuery = '', clearStore = false) => {
    try {
      await fetchGuidesPaginated(page, user_id, keywords, searchQuery, clearStore);
    } catch (error) {
      console.error('Ошибка при загрузке гайдов:', error);
    }
  };

  const handleSelectGuide = async (id, title) => {
    try {
      setTargetGuideTitle(title);
      await getGuideChapters(id);
      setTargetGuide(id);
    } catch (error) {
      console.error('Ошибка при получении глав гайда:', error);
    }
  };

  const handleKeywordSearch = () => {
    setTargetGuide(null);
    const keywords = selectedKeywords.map((keyword) => keyword.value).slice(0, 3);
    loadGuides(1, filterUserId, keywords, keywordSearchQuery, true);
    setCurrentPage(1);
  };

  const handleAddToFavorites = async () => {
    await addToFavorites(targetGuide, userData.id);
  };

  const handleRemoveFromFavorites = async () => {
    await removeFromFavorites(targetGuide, userData.id);
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

        <button type="button" onClick={handleKeywordSearch} className={styles.search_btn}>
          Search
        </button>
        <div className={styles.underline} />
      </div>

      {targetGuide && chaptersByGuide ? (
        <div className={styles.guides}>
          <div className={styles.btn_wrapper}>
            <button type="button" onClick={() => setTargetGuide(null)} className={styles.add_to_favorites_btn}>
              Back
            </button>
            {userData &&
              (favorites.includes(targetGuide) ? (
                <button type="button" onClick={handleRemoveFromFavorites} className={styles.add_to_favorites_btn}>
                  Remove from Favorites
                </button>
              ) : (
                <button type="button" onClick={handleAddToFavorites} className={styles.add_to_favorites_btn}>
                  Add to Favorites
                </button>
              ))}
          </div>
          <div className={styles.padding}>
            <h3 className={styles.h2}>{targetGuideTitle}</h3>
            <PreviewGuide className={styles.preview_guide} initialValues={{ chapters: chaptersByGuide[targetGuide] }} />
          </div>
        </div>
      ) : (
        <div className={styles.guides}>
          <div className={styles.guide_feed}>
            {Array.isArray(guidesListPaginated) &&
              guidesListPaginated.map((guide, i) => (
                <div
                  key={guide.id}
                  className={styles.guide_plate_img}
                  style={{ backgroundImage: guide.prev_img ? `url(${guide.prev_img})` : 'none' }}
                  onClick={() => handleSelectGuide(guide.id, guide.title, i)}
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
      )}
    </div>
  );
};

const mapDispatchToProps = {
  fetchGuidesPaginated,
  getGuideChapters,
  addToFavorites,
  getFavorites,
  removeFromFavorites,
};

const mapStateToProps = (state) => ({
  chaptersByGuide: state.creatorReducer?.chaptersByGuide || {},
  guidesListPaginated: state.guidesReducer?.guidesListPaginated?.data || [],
  totalGuides: state.guidesReducer?.guidesListPaginated?.total || 0,
  favorites: state.guidesReducer?.favorites.favorites || [],
  userData: state.auth.userData,
});

export default connect(mapStateToProps, mapDispatchToProps)(GuideExplorer);
