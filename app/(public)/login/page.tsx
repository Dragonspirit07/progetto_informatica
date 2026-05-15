"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./login.css";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Errore durante il login.");
      } else {
        router.push("/admin");
      }
    } catch {
      setError("Errore di rete. Riprova più tardi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-main">
      <div className="login-card">
        <div className="login-header">
          <h1>Area Riservata</h1>
          <p>Accesso amministratori <strong>AIKI CENTER ETS</strong></p>
        </div>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="login-field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              required
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              disabled={loading}
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              disabled={loading}
            />
          </div>

          {error && (
            <div className="login-error" role="alert">
              <i className="fa fa-exclamation-circle" aria-hidden="true" />
              {error}
            </div>
          )}

          <button className="btn login-btn" type="submit" disabled={loading}>
            {loading ? "Accesso in corso…" : "Accedi"}
          </button>
        </form>

        <div className="login-back">
          <Link href="/">← Torna al sito</Link>
        </div>
      </div>
    </main>
  );
}