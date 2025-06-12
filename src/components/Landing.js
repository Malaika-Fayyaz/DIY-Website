import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Art from "./Art";

const Landing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home"); // redirect to home after 2 seconds
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return <Art />;
};

export default Landing;
