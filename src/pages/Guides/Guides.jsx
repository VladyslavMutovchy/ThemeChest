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
  const [selectedKeywords, setSelectedKeywords] = useState([]); // Новое состояние для ключевых слов

  useEffect(() => {
    loadGuides(currentPage);
  }, [currentPage]);

  const loadGuides = async (page, keywords = []) => {
    try {
      setIsLoading(true);
      await fetchGuidesPaginated(page, keywords); // Обновленный вызов с ключевыми словами
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

  const handleKeywordSearch = () => {
    // Поиск по ключевым словам
    loadGuides(1, selectedKeywords.map(keyword => keyword.value)); // Используем выбранные ключевые слова для поиска на сервере
    setCurrentPage(1); // Обнуляем страницу для нового запроса
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
        <Select
          classNamePrefix="custom-select"
          styles={customStyles}
          options={KEYWORDS.map((keyword) => ({ value: keyword, label: keyword }))}
          onChange={setSelectedKeywords}
          value={selectedKeywords}
          placeholder="Search and select a theme"
          isMulti
          isClearable
        />
        <button 
          type="button" 
          onClick={handleKeywordSearch} 
          className={styles.search_btn}
        >
          Search by Keywords
        </button>

        {/* Фильтр на клиентской стороне */}
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
        <button 
          type="button" 
          className={styles.load_more_btn} 
          onClick={() => setCurrentPage((prevPage) => prevPage + 1)} 
          disabled={isLoading}
        >
          Load More Guides
        </button>
      </div>
    </div>
  );
};

// Обновляем mapDispatchToProps для передачи keywords
const mapDispatchToProps = (dispatch) => ({
  fetchGuidesPaginated: (page, keywords) => dispatch(fetchGuidesPaginated(page, keywords)),
});

const mapStateToProps = (state) => ({
  guidesListPaginated: state.guidesReducer?.guidesListPaginated?.data || [],
});

export default connect(mapStateToProps, mapDispatchToProps)(GuideExplorer);
