import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import styles from './Guides.module.css';
import { connect } from 'react-redux';
import { fetchGuidesPaginated } from '../../actions/guides';
import { customStyles } from '../../components/CreatorsComponents/styles.Select';
import { KEYWORDS } from '../../components/CreatorsComponents/keyWords';

const GuideExplorer = (props) => {
  const { guidesListPaginated = [], fetchGuidesPaginated } = props;

  const [targetGuide, setTargetGuide] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredGuides, setFilteredGuides] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [keywordSearchQuery, setKeywordSearchQuery] = useState('');

  useEffect(() => {
    loadGuides(currentPage);
  }, [currentPage]);

  const loadGuides = async (page, keywords = [], searchQuery = '', clearStore = false) => {
    try {
      setIsLoading(true);
      await fetchGuidesPaginated(page, keywords, searchQuery, clearStore);
      setIsLoading(false);
    } catch (error) {
      console.error('Ошибка при загрузке гайдов:', error);
      setIsLoading(false);
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

  const handleSelectGuide = (guide) => {
    setTargetGuide(guide);
  };

  const handleKeywordSearch = () => {
    const keywords = selectedKeywords.map((keyword) => keyword.value).slice(0, 3);
    loadGuides(1, keywords, keywordSearchQuery, true);
    setCurrentPage(1);
  };
  if (!Array.isArray(guidesListPaginated) || guidesListPaginated.length === 0) {
    return (
      <div className={styles.wrapper}>
        <div>Loading data...</div>
      </div>
    );
  }

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

        <button type="button" onClick={handleKeywordSearch} className={styles.search_btn} disabled={isLoading}>
          Search
        </button>

        <div className={styles.underline} />
      </div>

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
                onClick={() => handleSelectGuide(guide)}
              >
                <div className={styles.guide_plate_prev}>
                  <h3 className={styles.guide_plate_title}>{guide.title}</h3>
                  <p className={styles.guide_plate_p}>{guide.description}</p>
                </div>
              </div>
            ))}
          {isLoading && <div>Loading more guides...</div>}
        </div>

        <button type="button" className={styles.load_more_btn} onClick={() => setCurrentPage((prevPage) => prevPage + 1)} disabled={isLoading}>
          Load More Guides
        </button>
      </div>
    </div>
  );
};

const mapDispatchToProps = {
  fetchGuidesPaginated,
};

const mapStateToProps = (state) => ({
  guidesListPaginated: state.guidesReducer?.guidesListPaginated?.data || [],
});

export default connect(mapStateToProps, mapDispatchToProps)(GuideExplorer);
