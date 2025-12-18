'use client';

import { useState } from 'react';

export default function IntakeForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    industry: '',
    dataSensitivity: 'Public',
    users: '',
    goal: '',
    cloud: 'No preference'
  });

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(formData);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="industry" placeholder="Industry" onChange={handleChange} className="input" />

      <select name="dataSensitivity" onChange={handleChange} className="input">
        <option>Public</option>
        <option>PII</option>
        <option>HIPAA</option>
      </select>

      <input name="users" placeholder="Expected Users" onChange={handleChange} className="input" />

      <input name="goal" placeholder="Primary Goal (e.g. Analytics, App)" onChange={handleChange} className="input" />

      <select name="cloud" onChange={handleChange} className="input">
        <option>No preference</option>
        <option>AWS</option>
        <option>Azure</option>
        <option>GCP</option>
        <option>Salesforce</option>
      </select>

      <button className="btn-primary w-full">
        Generate Architecture
      </button>
    </form>
  );
}
