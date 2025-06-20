import '../../css/centeredContainer.css';
import { useTranslation } from 'react-i18next';

import useAuth from '../../hooks/useAuth';

export default function User({ isNavOpen }) {

  const { auth } = useAuth();
  const isAdmin = auth.roles.includes('Admin');
  const { t } = useTranslation();

  return (
    <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}>

      <div className="centered-container">
        <h3>{t('user.welcome')}</h3>
        <h2>{t('user.privatePage')}</h2>

        <div className="interaction-box">
          <h3>{t('user.whatsNext')}</h3>
          <ul>
            <li><strong>{t('user.updateProfileTitle')}</strong> {t('user.updateProfileDesc')}</li>
            <li><strong>{t('user.subscribeTitle')}</strong>{t('user.subscribeDesc')}</li>
            <li><strong>{t('user.testScenariosTitle')}</strong>
              <ul>
                <li>{t('user.scenario.deleteAndSignup')}</li>
                {isAdmin &&
                  <li>{t('user.scenario.adminRoles')}</li>
                }
              </ul>
            </li>
          </ul>
        </div>
      </div>

    </div>
  );
}
