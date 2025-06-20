import { useTranslation } from 'react-i18next';

export default function Moderator({ isNavOpen }) {
  const { t } = useTranslation();

  return (
    <div className={isNavOpen ? 'body-squeezed' : 'body'}>
      <div className="centered-container">
        <h2>{t('moderator.privatePage')}</h2>

        <div className="interaction-box">
          <ul>
            <li><strong>{t('moderator.exploreScenariosTitle')}</strong></li>
            <li>- {t('moderator.scenario.reportPost')}</li>
            <li>- {t('moderator.scenario.markInappropriate')}</li>
            <li>- {t('moderator.scenario.viewHiddenPost')}</li>
            <li>- {t('moderator.scenario.restorePost')}</li>
            <li>- {t('moderator.scenario.reviewHistory')}</li>
            <li>- {t('moderator.scenario.repeatCommentActions')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
