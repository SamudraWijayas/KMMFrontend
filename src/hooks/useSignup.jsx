import { useState } from "react";
import { useAuth } from "../context";

const useSignup = () => {
  const { login } = useAuth();
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(null)
  return {};
};

export default useSignup