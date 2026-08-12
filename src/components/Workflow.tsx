interface Step {
  letter: string;
  title: string;
  description: string;
}

interface Props {
  steps: Step[];
}

export default function Workflow({ steps }: Props) {
  return (
    <div className="page">
      <div className="page-header">
        <h1>CRED-IT Quality Improvement Cycle</h1>
        <p className="subtitle">Closed-loop credentialing system — continuous, not a one-time filing cabinet</p>
      </div>

      <div className="cycle-intro">
        <p>
          The system continuously tracks every physician and healthcare professional from initial application through
          verification, privileging, renewal, and recredentialing.
        </p>
      </div>

      <div className="cycle-grid">
        {steps.map((step, idx) => (
          <div key={step.letter} className="cycle-card">
            <div className="cycle-letter">{step.letter}</div>
            <div className="cycle-content">
              <h3>
                {idx + 1}. {step.title}
              </h3>
              <p>{step.description}</p>
            </div>
            {idx < steps.length - 1 && <div className="cycle-arrow">→</div>}
          </div>
        ))}
      </div>

      <div className="section strategy-box">
        <h2>Overall Quality Strategy (Electronic Action Plan)</h2>
        <div className="strategy-table-wrap">
          <table className="data-table strategy">
            <thead>
              <tr>
                <th>#</th>
                <th>Strategy</th>
                <th>Electronic Action Plan</th>
                <th>Target</th>
                <th>Timeline</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td className="font-medium">Build One Credentialing Database</td>
                <td>Create one electronic master list of all doctors & healthcare professionals</td>
                <td>100% of active professionals encoded</td>
                <td>Months 1–2</td>
              </tr>
              <tr>
                <td>2</td>
                <td className="font-medium">Digitize All Credentials</td>
                <td>Scan & upload PRC ID, specialty certs, training, PhilHealth docs, privileges</td>
                <td>≥95% complete digital files</td>
                <td>Months 1–3</td>
              </tr>
              <tr>
                <td>3</td>
                <td className="font-medium">Introduce Electronic Verification</td>
                <td>Verify PRC license electronically and record verification evidence</td>
                <td>100% PRC licenses verified online</td>
                <td>Months 2–4</td>
              </tr>
              <tr>
                <td>4</td>
                <td className="font-medium">Automated Expiration Alerts</td>
                <td>System flags credentials 90 / 60 / 30 days before expiry</td>
                <td>Zero surprise expirations</td>
                <td>Month 3 onward</td>
              </tr>
              <tr>
                <td>5</td>
                <td className="font-medium">Electronic Privileging</td>
                <td>Link verified credentials to approved privileges by department</td>
                <td>100% current privileges mapped</td>
                <td>Months 4–6</td>
              </tr>
              <tr>
                <td>6</td>
                <td className="font-medium">Compliance Dashboard & Audit Trail</td>
                <td>Real-time scores, deficiency tracking, full audit history</td>
                <td>100% monthly electronic monitoring</td>
                <td>Month 6 onward</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="section statement-box">
        <h3>Recommended Strategic Statement</h3>
        <blockquote>
          “Achieve and sustain 100% credentialing and privileging compliance through a centralized electronic
          credential management system that provides real-time verification, automated expiration alerts, electronic
          privileging, compliance dashboards, audit trails and proactive recredentialing.”
        </blockquote>
      </div>
    </div>
  );
}
