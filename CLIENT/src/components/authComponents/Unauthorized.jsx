import { useNavigate } from "react-router-dom"
import '../../css/Unauthorized.css'

const Unauthorized = () => {
    const navigate = useNavigate();

    const goBack = () => navigate(-1);

    return (
        <section className="unauthorized">
            <div className="unauthorized-title">Unauthorized</div>
            <br />
            <p>You do not have access to the requested page.</p>
            <div>
                <button className="unauthorized-go-back" onClick={goBack}>Go Back</button>
            </div>
        </section>
    )
}

export default Unauthorized
