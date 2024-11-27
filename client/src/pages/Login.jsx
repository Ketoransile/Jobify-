import { Link, Form, redirect, useNavigate } from "react-router-dom";
import Wrapper from "../assets/wrappers/RegisterAndLoginPage";
import { FormRow, Logo, SubmitBtn } from "../components";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    await customFetch.post("/auth/login", data);
    toast.success("Login Successfull");
    return redirect("/dashboard");
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};
const Login = () => {
  const navigate = useNavigate();
  const logniDemoUser = async () => {
    const data = {
      email: "test@test.com",
      password: "secret123",
    };
    try {
      await customFetch.post("/auth/login", data);
      toast.success("Take a test drive");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.msg);
      return error;
    }
  };
  return (
    <Wrapper>
      <Form method="post" className="form">
        <Logo />
        <h4>Login</h4>
        <FormRow type="email" name="email" />
        <FormRow type="password" name="password" />
        <SubmitBtn />
        <button type="submit" className="btn btn-block" onClick={logniDemoUser}>
          Explore the App
        </button>
        <p>
          Not a member yet?
          <Link to="/register" className="member-btn">
            Regsiter
          </Link>
        </p>
      </Form>
    </Wrapper>
  );
};

export default Login;