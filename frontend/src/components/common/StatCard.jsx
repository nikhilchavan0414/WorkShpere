export default function StatCard({ label, value, icon, color = 'primary' }) {
  const colors = {
    primary: { bg: '#dbeafe', text: '#2563eb' },
    success: { bg: '#dcfce7', text: '#16a34a' },
    warning: { bg: '#fef3c7', text: '#d97706' },
    danger: { bg: '#fee2e2', text: '#dc2626' },
    info: { bg: '#e0f2fe', text: '#0284c7' },
  };
  const c = colors[color] || colors.primary;

  return (
    <div className="stat-card">
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <div className="stat-label">{label}</div>
          <div className="stat-value">{value ?? 0}</div>
        </div>
        {icon && (
          <div className="stat-icon" style={{ background: c.bg, color: c.text }}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
