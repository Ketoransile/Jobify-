import Wrapper from "../assets/wrappers/LandingPage";
import main from "../assets/images/main.svg";
import { Logo } from "../components";
import { Link } from "react-router-dom";
const Landing = () => {
  return (
    <Wrapper>
      <nav>
        <Logo />
      </nav>
      <div className="container page">
        <div className="info">
          <h1>
            Job <span> Tracking</span> app
          </h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Non
            inventore fugiat amet dolore molestias nobis iure cum, id sapiente
            suscipit aliquam impedit reiciendis repudiandae corporis obcaecati
            soluta in, placeat porro?Lorem ipsum, dolor sit amet consectetur
            adipisicing elit. Commodi, facere fugit error quibusdam ea
            exercitationem distinctio totam praesentium debitis tempora nisi
            dolorem, eum mollitia nesciunt eius aspernatur ipsum rerum?
            Inventore.
          </p>
          <Link to="/register" className="btn register-link">
            Register
          </Link>
          <Link to="/login" className="btn ">
            Login / Demo user
          </Link>
        </div>
        <img src={main} alt="job hunt" className="img main-img" />
      </div>
    </Wrapper>
  );
};

export default Landing;
