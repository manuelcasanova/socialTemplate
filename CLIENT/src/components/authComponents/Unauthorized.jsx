import { useNavigate } from "react-router-dom"
import '../../css/Unauthorized.css'
//Translation
import { useTranslation } from 'react-i18next';

const Unauthorized = ({ isNavOpen }) => {

    const { t } = useTranslation();
    const navigate = useNavigate();
    const goBack = () => navigate(-1);

    return (
        <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}>
            <div className="unauthorized">
                <div className="unauthorized-title">{t('unauthorized.title')}</div>
                <br />
                <p>{t('unauthorized.message')}</p>
                <div>
                    <button className="unauthorized-go-back" onClick={goBack}>{t('unauthorized.goBack')}</button>
                </div>
            </div>
        </div>
    )
}

export default Unauthorized
