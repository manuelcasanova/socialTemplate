//Translation
import { useTranslation } from 'react-i18next';

export default function Error({ isNavOpen, error }) {

  const { t } = useTranslation();

  return (
    <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}>
      <div className="centered-container">
        <h2>{t('error.title')}</h2>

        <div className="error-header">{t('error.whatCanYouDo')}</div>
        {t('error.suggestions', { returnObjects: true }).map((s, i) => (
          <div key={i} className="error-suggestion">{s}</div>
        ))}
        <div className="error-message">
          <div className="error-message">
            {typeof error === 'string'
              ? error
              : error?.response?.data?.message || error?.message || 'An unknown error occurred'}
          </div>
        </div>
      </div>
    </div>


  )
}