import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../../css/centeredContainer.css';

export default function Home({ isNavOpen }) {
  const { t } = useTranslation();

  // Safely get scenarios
  const scenarios = t('home.scenarios', { returnObjects: true });
  const scenarioList = Array.isArray(scenarios) ? scenarios : [];

  console.log('SCENARIOS:', scenarios); // Debug: see what t() returns

  return (
    <div className={isNavOpen ? 'body-squeezed' : 'body'}>
      <div className="centered-container">
        <h2>{t('home.welcome')}</h2>

        <p>{t('home.intro')}</p>

        <ul>
          <li><strong>{t('home.secureLogin')}</strong></li>
          <li><strong>{t('home.userMgmt')}</strong></li>
          <li><strong>{t('home.roleAccess')}</strong></li>
          <li><strong>{t('home.responsiveLayout')}</strong></li>
        </ul>

        <p>{t('home.technologiesUsed')}</p>
        <ul>
          <li><strong>{t('home.backend')}</strong>{t('home.backend-detail')}</li>
          <li><strong>{t('home.frontend')}</strong> ReactJS</li>
          <li><strong>{t('home.database')}</strong> PostgreSQL</li>
        </ul>

        <div className="interaction-box">
          <h3>{t('home.getStartedTitle')}</h3>
          <ul>
            <li>
              <strong>{t('home.signUp')}</strong>{' '}
              <Link to="/signup">{t('home.signUpCreate')}</Link>
            </li>
            <li>
              <strong>{t('home.signIn')}</strong> {t('home.signInDesc')}
            </li>
            <li>
              <strong>{t('home.exploreScenarios')}</strong>
              <ul>
                {t('home.scenarios', { returnObjects: true }).map((scenario, index) => (
                  <li key={index}>- {scenario}</li>
                ))}
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
