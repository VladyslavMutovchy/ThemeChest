import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import styles from './Guides.module.css';
import { connect } from 'react-redux';
import { fetchGuidesPaginated } from '../../actions/guides';
import { customStyles } from '../../components/CreatorsComponents/styles.Select';
import { KEYWORDS } from '../../components/CreatorsComponents/keyWords';
import { getGuideChapters } from '../../actions/creator';
import PreviewGuide from '../../components/CreatorsComponents/PreviewGuide';

const GuideExplorer = (props) => {
  const { guidesListPaginated = [], getGuideChapters, fetchGuidesPaginated, chaptersByGuide } = props;

  const [targetGuide, setTargetGuide] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredGuides, setFilteredGuides] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [keywordSearchQuery, setKeywordSearchQuery] = useState('');

  useEffect(() => {
    loadGuides(currentPage);
  }, [currentPage]);

  const loadGuides = async (page, keywords = [], searchQuery = '', clearStore = false) => {
    try {
      await fetchGuidesPaginated(page, keywords, searchQuery, clearStore);
     
    } catch (error) {
      console.error('Ошибка при загрузке гайдов:', error);
      
    }
  };

  useEffect(() => {
    if (searchQuery) {
      const filtered = guidesListPaginated.filter((guide) => guide.title.toLowerCase().includes(searchQuery.toLowerCase()));
      setFilteredGuides(filtered);
    } else {
      setFilteredGuides(guidesListPaginated);
    }
  }, [searchQuery, guidesListPaginated]);

  const handleSelectGuide = async (id) => {
    try {
      await getGuideChapters(id);
      setTargetGuide(id);
    } catch (error) {
      console.error('Ошибка при получении глав гайда:', error);
     
    }
  };



  const handleKeywordSearch = () => {
    setTargetGuide(null);
    const keywords = selectedKeywords.map((keyword) => keyword.value).slice(0, 3);
    loadGuides(1, keywords, keywordSearchQuery, true);
    setCurrentPage(1);
  };

  const handleAddToFavorites = () => {
    console.log('Guide added to favorites:', targetGuide);
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
            <button type="button" onClick={handleAddToFavorites} className={styles.add_to_favorites_btn}>
              Add to Favorites
            </button>
          </div>
          <div className={styles.padding}>
            <PreviewGuide className={styles.preview_guide} initialValues={{ chapters: chaptersByGuide[targetGuide] }} />
          </div>
        </div>
      ) : (
        <div className={styles.guides}>
          <input
            type="text"
            className={styles.search_input}
            placeholder="Search guides by title or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className={styles.guide_feed}>
            {Array.isArray(filteredGuides) &&
              filteredGuides.map((guide) => (
                <div
                  key={guide.id}
                  className={styles.guide_plate_img}
                  style={{
                    backgroundImage: guide.prev_img ? `url(${guide.prev_img})` : 'none',
                  }}
                  onClick={() => handleSelectGuide(guide.id)}
                >
                  <div className={styles.guide_plate_prev}>
                    <h3 className={styles.guide_plate_title}>{guide.title}</h3>
                    <p className={styles.guide_plate_p}>{guide.description}</p>
                  </div>
                </div>
              ))}
          </div>

          <button type="button" className={styles.load_more_btn} onClick={() => setCurrentPage((prevPage) => prevPage + 1)}>
            Load More Guides
          </button>
        </div>
      )}
    </div>
  );
};

const mapDispatchToProps = {
  fetchGuidesPaginated,
  getGuideChapters,
};

const mapStateToProps = (state) => ({
  chaptersByGuide: state.creatorReducer?.chaptersByGuide || {},
  guidesListPaginated: state.guidesReducer?.guidesListPaginated?.data || [],
});

export default connect(mapStateToProps, mapDispatchToProps)(GuideExplorer);
