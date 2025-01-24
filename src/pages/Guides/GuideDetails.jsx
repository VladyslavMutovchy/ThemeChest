import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import PreviewGuide from '../../components/CreatorsComponents/PreviewGuide';
import styles from './GuideDetails.module.css';
import { getGuideChapters, getPreviewGuide } from '../../actions/creator';
import { addToFavorites, removeFromFavorites } from '../../actions/guides';

const GuideDetails = ({
  chaptersByGuide,
  guidePreview,
  getGuideChapters,
  getPreviewGuide,
  addToFavorites,
  removeFromFavorites,
  favorites,
  userData,
}) => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      getPreviewGuide(id);
      getGuideChapters(id); 
    }
  }, [id, getPreviewGuide, getGuideChapters]);

  const chapters = chaptersByGuide[id] || [];
  const isFavorite = favorites.includes(Number(id)); 
  const handleAddToFavorites = async () => {
    if (userData) {
      await addToFavorites(id, userData.id);
    }
  };

  const handleRemoveFromFavorites = async () => {
    if (userData) {
      await removeFromFavorites(id, userData.id);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.guides}>
        <div className={styles.btn_wrapper}>
          <button type="button" onClick={() => navigate(-1)} className={styles.add_to_favorites_btn}>
            Back
          </button>
          {userData &&
            (isFavorite ? (
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
          <h1 className={styles.h1}>{guidePreview.title || 'Loading...'}</h1>
          <p className={styles.p}>{guidePreview.description || 'Loading...'}</p>
          {chapters.length > 0 ? (
            <PreviewGuide className={styles.preview_guide} initialValues={{ chapters }} />
          ) : (
            <p className={styles.loading_text}>Loading chapters...</p>
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  chaptersByGuide: state.creatorReducer?.chaptersByGuide || {},
  favorites: state.guidesReducer?.favorites?.favorites || [],
  userData: state.auth?.userData,
  guidePreview: state.creatorReducer.guidePreview || {}, // Данные гайда из Redux
});

const mapDispatchToProps = {
  getGuideChapters,
  getPreviewGuide, // Добавлено действие для загрузки гайда
  addToFavorites,
  removeFromFavorites,
};

export default connect(mapStateToProps, mapDispatchToProps)(GuideDetails);
