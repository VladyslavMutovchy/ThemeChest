import React, { useState, useEffect } from 'react';
import styles from './Guides.module.css';
import { connect } from 'react-redux';
import { fetchGuidesPaginated } from '../../actions/guides';

const GuideExplorer = (props) => {
  const { guidesListPaginated = [], fetchGuidesPaginated } = props;

  const [targetGuide, setTargetGuide] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredGuides, setFilteredGuides] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadGuides(currentPage);
  }, [currentPage]);

  const loadGuides = async (page) => {
    try {
      setIsLoading(true);
      await fetchGuidesPaginated(page);
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

  const handleSelectGuide = async (guide) => {
    setTargetGuide(guide);
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
          placeholder="Search guides by title or keywords..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className={styles.underline} />
      </div>
      <div className={styles.guides}>
        <div className={styles.guide_feed}>
          {Array.isArray(filteredGuides) &&
            filteredGuides.map((guide, index) => (
              <div key={index} className={styles.guide_plate} onClick={() => handleSelectGuide(guide)}>
                <h3>{guide.title}</h3>
              </div>
            ))}
          {isLoading && <div>Loading more guides...</div>}
        </div>
        <button type="button" className={styles.load_more_btn} onClick={() => setCurrentPage((prevPage) => prevPage + 1)} disabled={isLoading}>
          Load More Guides
        </button>
        {/* {targetGuide ? (
          <div className={styles.previewWrapper}>
            <h2>{targetGuide.title}</h2>
            <p>Here you can display detailed content about the selected guide...</p>
          </div>
        ) : (
          <div className={styles.intro_message}>
            <h2>Welcome to Guide Explorer</h2>
            <p>Use the search box on the left to filter guides by title or keywords. Select a guide to see more details.</p>
          </div>
        )} */}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  guidesListPaginated: state.guidesReducer?.guidesListPaginated?.data || [],
});

const mapDispatchToProps = {
  fetchGuidesPaginated,
};

export default connect(mapStateToProps, mapDispatchToProps)(GuideExplorer);
