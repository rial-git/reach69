import React from "react";
import accountLogo from "../assets/accountLogo.svg";
import { useNavigate } from "react-router-dom";
import "../css/account.css";

export default function AccountIcon({ user }) {
  const navigate = useNavigate();
  if (!user) return null;
  return (
    <button
      className="account-icon-btn"
      onClick={() => navigate("/account")}
      title="Account"
    >
      <accountLogo size={36} color="#222" />
    </button>
  );
}