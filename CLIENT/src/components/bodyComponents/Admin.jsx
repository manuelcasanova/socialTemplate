import { useTranslation } from 'react-i18next';

export default function Admin({ isNavOpen }) {

  const { t } = useTranslation();

  return (
    <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}>
      <div className="centered-container">
        <h2>{t('admin.privatePage')}</h2>

        <div className="interaction-box">
          <li>
            <ul>
              <li><strong>{t('admin.exploreTitle')}</strong></li>
              <li>{t('admin.scenario.modifyRoles')}</li>
              <li>{t('admin.scenario.deleteUser')}</li>
              <li>{t('admin.scenario.viewHistory')}</li>
              <li>{t('admin.scenario.adjustSettings')}</li>
            </ul>

          </li>


        </div>
      </div>
    </div>

  )
}





