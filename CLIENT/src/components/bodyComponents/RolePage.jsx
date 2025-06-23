//Translation
import { useTranslation } from 'react-i18next';

export default function RolePage({ isNavOpen, role }) {

  const { t } = useTranslation();

  return (
    <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}>
      <div className="centered-container">
        <h2>{t('rolePage.title', { role: role.role_name })}</h2>


        <div className="interaction-box">
          <li>
            <ul>
              <li><strong>{t('rolePage.exploreAdminScenarios')}</strong></li>
              <li>{t('rolePage.scenarioModifyRoles')}</li>
              <li>{t('rolePage.scenarioManageRoles')}</li>

            </ul>

          </li>


        </div>
      </div>
    </div>

  )
}






