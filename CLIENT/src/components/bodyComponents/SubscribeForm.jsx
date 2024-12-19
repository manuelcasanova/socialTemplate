import Footer from "../mainComponents/footer";

export default function SubscribeForm ({isNavOpen}) {
    return (
        <div className={`body-footer ${isNavOpen ? 'body-footer-squeezed' : ''}`}>
        <div className="body">
        <h2>Subscribe to our service</h2>
        </div>
  <Footer />
      </div>
    );
}