import { useNavigate } from "react-router-dom"
import '../../css/Unauthorized.css'

const Unauthorized = ({ isNavOpen }) => {
    const navigate = useNavigate();

    const goBack = () => navigate(-1);

    return (
        <div className={`${isNavOpen ? 'body-squeezed' : 'body'}`}>
            <div className="unauthorized">
                <div className="unauthorized-title">Unauthorized</div>
                <br />
                <p>You do not have access to the requested page.</p>
                <div>
                    <button className="unauthorized-go-back" onClick={goBack}>Go Back</button>
                </div>
            </div>
        </div>
    )
}

export default Unauthorized
