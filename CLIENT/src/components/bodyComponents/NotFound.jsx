import Footer from "../mainComponents/footer"
import '../../css/NotFound.css'
//Translation
import { useTranslation } from 'react-i18next';

export default function NotFound({ isNavOpen }) {

    const { t } = useTranslation();

  return (
    <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}>
      <div className="not-found">
      <h1>{t('notFound.title')}</h1>
      <p>{t('notFound.message')}</p>
      </div>
    </div>
    
  )
}