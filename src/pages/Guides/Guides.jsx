import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import styles from './Guides.module.css';
import { connect } from 'react-redux';
import { fetchGuidesPaginated, getFavorites } from '../../actions/guides';
import { customStyles } from '../../components/CreatorsComponents/styles.Select';
import { KEYWORDS } from '../../components/CreatorsComponents/keyWords';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, Input } from '../../components/UI';

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
    <div className={styles.guidesPage}>
      <div className={styles.guidesHeader}>
        <div className={styles.container}>
          <h1 className={styles.pageTitle}>Explore Guides</h1>
          <p className={styles.pageDescription}>
            Discover guides on various topics created by our community
          </p>
        </div>
      </div>

      <div className={styles.guidesContent}>
        <div className={styles.container}>
          <div className={styles.guidesLayout}>
            {/* Filters Sidebar */}
            <aside className={styles.filtersSidebar}>
              <Card className={styles.filtersCard}>
                <h2 className={styles.filtersTitle}>Search & Filter</h2>

                <div className={styles.filterGroup}>
                  <Input
                    type="text"
                    placeholder="Search guides by title..."
                    value={keywordSearchQuery}
                    onChange={(e) => setKeywordSearchQuery(e.target.value)}
                    fullWidth
                  />
                </div>

                <div className={styles.filterGroup}>
                  <label className={styles.filterLabel}>Topics</label>
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
                </div>

                {userData && (
                  <div className={styles.filterGroup}>
                    <label className={styles.favoriteCheckbox}>
                      <input
                        type="checkbox"
                        checked={filterUserId === userData.id}
                        onChange={(e) => setFilterUserId(e.target.checked ? userData.id : 0)}
                      />
                      <span>Show Favorites Only</span>
                    </label>
                  </div>
                )}

                <div className={styles.filterActions}>
                  <Button
                    variant="primary"
                    onClick={handleKeywordSearch}
                    fullWidth
                  >
                    Apply Filters
                  </Button>
                </div>

                {userData && (
                  <div className={styles.createGuideSection}>
                    <div className={styles.divider}></div>
                    <p className={styles.createGuideText}>Want to share your knowledge?</p>
                    <Link to="/AiCreator">
                      <Button variant="secondary" fullWidth>
                        Create with AI
                      </Button>
                    </Link>
                  </div>
                )}
              </Card>
            </aside>

            {/* Guides Grid */}
            <div className={styles.guidesGridContainer}>
              <div className={styles.guidesControls}>
                <h2 className={styles.resultsTitle}>Results</h2>
                <div className={styles.sortControls}>
                  <select className={styles.sortSelect}>
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="popular">Most Popular</option>
                  </select>
                </div>
              </div>

              {guidesListPaginated.length === 0 ? (
                <div className={styles.noResults}>
                  <p>No guides found matching your criteria.</p>
                  <Button variant="outline" onClick={() => {
                    setSelectedKeywords([]);
                    setKeywordSearchQuery('');
                    setFilterUserId(0);
                    loadGuides(1, 0, [], '', true);
                  }}>
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className={styles.guidesGrid}>
                  {Array.isArray(guidesListPaginated) &&
                    guidesListPaginated.map((guide) => (
                      <Card key={guide.id} className={styles.guideCard} onClick={() => handleSelectGuide(guide.id)}>
                        <div
                          className={styles.guideCardImage}
                          style={{ backgroundImage: guide.prev_img ? `url(${guide.prev_img})` : 'none' }}
                        ></div>
                        <div className={styles.guideCardContent}>
                          <h3 className={styles.guideCardTitle}>{guide.title}</h3>
                          <p className={styles.guideCardDescription}>{guide.description}</p>
                        </div>
                      </Card>
                    ))
                  }
                </div>
              )}

              {canLoadMore && (
                <div className={styles.loadMoreContainer}>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
                  >
                    Load More Guides
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
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
